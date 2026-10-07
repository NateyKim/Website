<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  const bio = [
    'I am a research engineer at Penn’s GRASP Laboratory working at the intersection of assistive robotics, human movement, and human–robot interaction. I earned an M.S.E. in Robotics and a B.S.E. in Bioengineering from the University of Pennsylvania.',
    'My research spans upper-limb exoskeletons, EMG-informed musculoskeletal digital twins, human-in-the-loop control, machine learning for injury assessment, and socially assistive robots. I build systems that translate neuromuscular intent into adaptive, intuitive, and clinically meaningful technologies.',
    'Alongside my work at Penn, I am a research resident at Maingen, where I study machine-learning methods for robotic end-effector design, and a founding mechanical engineer at Tadashi Robotics, where I am helping translate the Ember social-robotics platform into a rehabilitative product.'
  ];

  let pointerX = 0;
  let pointerY = 0;
  let isMoving = false;
  let emgIntensity = 0;
  let targetEmgIntensity = 0;
  let emgSamples = Array(240).fill(0);
  let activeMotorUnits: Array<{ age: number; amplitude: number }> = [];
  let gripping = false;
  let previousPointerX = 0;
  let previousPointerY = 0;
  let previousMoveTime = 0;
  let movementTimer: ReturnType<typeof setTimeout>;
  let gripTimer: ReturnType<typeof setTimeout>;
  let emgTimer: ReturnType<typeof setInterval>;
  let leftRobot: SVGSVGElement;
  let rightRobot: SVGSVGElement;
  let leftTargetX = 190;
  let leftTargetY = 218;
  let rightTargetX = 80;
  let rightTargetY = 218;
  let desiredLeftTargetX = 190;
  let desiredLeftTargetY = 218;
  let desiredRightTargetX = 80;
  let desiredRightTargetY = 218;
  let leftPose = { upperRotation: 0, forearmRotation: 0, wristRotation: 0 };
  let rightPose = { upperRotation: 0, forearmRotation: 0, wristRotation: 0 };
  let leftToolAngle = 180;
  let rightToolAngle = 180;
  let leftRoutingViaNeutral = false;
  let rightRoutingViaNeutral = false;
  let armAnimationFrame = 0;
  let previousArmTime = 0;
  let robotDebug = true;
  const graspCenterOffset = 45.5;
  // Collision envelope for the fully open gripper, including stroke width.
  const gripperEnvelope = [[0, -32], [61, -32], [61, 32], [0, 32]] as const;
  type CollisionPoint = { x: number; y: number };

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const now = performance.now();
    const nextX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const nextY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    const elapsed = Math.max(16, now - previousMoveTime);
    const velocity = Math.hypot(nextX - previousPointerX, nextY - previousPointerY) * (1000 / elapsed);

    pointerX = nextX;
    pointerY = nextY;
    previousPointerX = nextX;
    previousPointerY = nextY;
    previousMoveTime = now;
    targetEmgIntensity = clamp(velocity * 0.24, 0.12, 1);
    isMoving = true;

    if (leftRobot && rightRobot) {
      const leftRect = leftRobot.getBoundingClientRect();
      const rightRect = rightRobot.getBoundingClientRect();
      // Both robots independently aim the center of their pinch aperture at
      // the cursor; solveArm's tool offset maps this target to the wrist.
      desiredLeftTargetX = ((event.clientX - leftRect.left) / leftRect.width) * 270;
      desiredLeftTargetY = ((event.clientY - leftRect.top) / leftRect.height) * 520;
      desiredRightTargetX = ((event.clientX - rightRect.left) / rightRect.width) * 270;
      desiredRightTargetY = ((event.clientY - rightRect.top) / rightRect.height) * 520;
    }

    clearTimeout(movementTimer);
    movementTimer = setTimeout(() => {
      isMoving = false;
      targetEmgIntensity = 0;
    }, 180);
  }

  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
    isMoving = false;
    targetEmgIntensity = 0;
    desiredLeftTargetX = 190;
    desiredLeftTargetY = 218;
    desiredRightTargetX = 80;
    desiredRightTargetY = 218;
  }

  function handleScenePress(event: PointerEvent) {
    if ((event.target as HTMLElement).closest('a')) return;
    gripping = true;
    clearTimeout(gripTimer);
    gripTimer = setTimeout(() => (gripping = false), 420);
  }

  const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
  const radiansToDegrees = (value: number) => (value * 180) / Math.PI;
  const normalizeAngle = (value: number) => ((value + 540) % 360) - 180;
  function moveAngleToward(current: number, target: number, maximumStep: number) {
    const difference = ((target - current + 540) % 360) - 180;
    return current + clamp(difference, -maximumStep, maximumStep);
  }

  function enforceSafePose(
    _side: 'left' | 'right',
    pose: { upperRotation: number; forearmRotation: number; wristRotation: number }
  ) {
    // Wall mounting removes the former upper/lower floor half-plane. Keep
    // angles finite; the per-part collision solver determines valid poses.
    return {
      upperRotation: clamp(pose.upperRotation, -175, 175),
      forearmRotation: clamp(pose.forearmRotation, -175, 175),
      wristRotation: clamp(pose.wristRotation, -175, 175)
    };
  }

  function calculateArmGeometry(
    side: 'left' | 'right',
    pose: { upperRotation: number; forearmRotation: number; wristRotation: number },
    targetX: number,
    targetY: number,
    requestedToolAngle?: number
  ) {
    const baseX = side === 'left' ? 45 : 225;
    const baseY = 260;
    const linkOne = 118.75;
    const linkTwo = 117.07;
    const baseAngleOne = side === 'left' ? 0 : 180;
    const baseAngleTwo = side === 'left' ? 0 : 180;
    const shoulderAngle = ((baseAngleOne + pose.upperRotation) * Math.PI) / 180;
    const forearmAngle = ((baseAngleTwo + pose.upperRotation + pose.forearmRotation) * Math.PI) / 180;
    const elbowX = baseX + Math.cos(shoulderAngle) * linkOne;
    const elbowY = baseY + Math.sin(shoulderAngle) * linkOne;
    const wristX = elbowX + Math.cos(forearmAngle) * linkTwo;
    const wristY = elbowY + Math.sin(forearmAngle) * linkTwo;
    const defaultToolAngle = side === 'left' ? 0 : 180;
    const targetToolAngle = requestedToolAngle ?? radiansToDegrees(Math.atan2(targetY - wristY, targetX - wristX));
    // The gripper's local x-axis is the normal of its fixed contact surface.
    // Keep it aimed directly at the target; the collision boxes, rather than
    // an arbitrary wrist-angle clamp, decide whether that pose is admissible.
    const angleDifference = ((targetToolAngle - defaultToolAngle + 540) % 360) - 180;
    const toolAngle = defaultToolAngle + angleDifference;

    return { baseX, baseY, elbowX, elbowY, wristX, wristY, toolAngle };
  }

  function mirrorArmGeometry(geometry: ReturnType<typeof calculateArmGeometry>) {
    return {
      ...geometry,
      baseX: 270 - geometry.baseX,
      elbowX: 270 - geometry.elbowX,
      wristX: 270 - geometry.wristX,
      toolAngle: 180 - geometry.toolAngle
    };
  }

  function segmentBox(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    halfWidth: number,
    trimStart = 0,
    trimEnd = 0
  ): CollisionPoint[] {
    const length = Math.hypot(endX - startX, endY - startY) || 1;
    const ux = (endX - startX) / length;
    const uy = (endY - startY) / length;
    const px = -uy * halfWidth;
    const py = ux * halfWidth;
    const ax = startX + ux * trimStart;
    const ay = startY + uy * trimStart;
    const bx = endX - ux * trimEnd;
    const by = endY - uy * trimEnd;
    return [
      { x: ax + px, y: ay + py }, { x: bx + px, y: by + py },
      { x: bx - px, y: by - py }, { x: ax - px, y: ay - py }
    ];
  }

  function transformedGripperBox(geometry: ReturnType<typeof calculateArmGeometry>): CollisionPoint[] {
    const radians = (geometry.toolAngle * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    return gripperEnvelope.map(([x, y]) => ({
      x: geometry.wristX + x * cosine - y * sine,
      y: geometry.wristY + x * sine + y * cosine
    }));
  }

  function jointBox(centerX: number, centerY: number, radius: number): CollisionPoint[] {
    return [
      { x: centerX - radius, y: centerY - radius },
      { x: centerX + radius, y: centerY - radius },
      { x: centerX + radius, y: centerY + radius },
      { x: centerX - radius, y: centerY + radius }
    ];
  }

  function boxesOverlap(first: CollisionPoint[], second: CollisionPoint[]) {
    const polygons = [first, second];
    for (const polygon of polygons) {
      for (let index = 0; index < polygon.length; index += 1) {
        const next = (index + 1) % polygon.length;
        const edgeX = polygon[next].x - polygon[index].x;
        const edgeY = polygon[next].y - polygon[index].y;
        const axisX = -edgeY;
        const axisY = edgeX;
        const project = (points: CollisionPoint[]) => points.map((point) => point.x * axisX + point.y * axisY);
        const firstProjection = project(first);
        const secondProjection = project(second);
        if (Math.max(...firstProjection) < Math.min(...secondProjection) || Math.max(...secondProjection) < Math.min(...firstProjection)) {
          return false;
        }
      }
    }
    return true;
  }

  function geometryIsCollisionFree(geometry: ReturnType<typeof calculateArmGeometry>) {
    // Every visible rigid body has its own conservative boundary box. Adjacent
    // bodies intentionally share a joint, so only non-adjacent pairs are tested.
    const upperBox = segmentBox(geometry.baseX, geometry.baseY, geometry.elbowX, geometry.elbowY, 10, 23, 20);
    const forearmBox = segmentBox(geometry.elbowX, geometry.elbowY, geometry.wristX, geometry.wristY, 10, 20, 17);
    const elbowBox = jointBox(geometry.elbowX, geometry.elbowY, 20);
    const wristBox = jointBox(geometry.wristX, geometry.wristY, 18);
    const gripperBox = transformedGripperBox(geometry);
    const baseBox: CollisionPoint[] = [
      { x: 220, y: 190 }, { x: 270, y: 190 }, { x: 270, y: 330 }, { x: 220, y: 330 }
    ];
    const movingBoxes = [upperBox, elbowBox, forearmBox, wristBox, gripperBox];
    const clearsWall = movingBoxes.every((box) => box.every((point) => point.x <= 257));

    return clearsWall
      && !boxesOverlap(baseBox, elbowBox)
      && !boxesOverlap(baseBox, forearmBox)
      && !boxesOverlap(baseBox, wristBox)
      && !boxesOverlap(baseBox, gripperBox)
      && !boxesOverlap(upperBox, wristBox)
      && !boxesOverlap(upperBox, gripperBox)
      && !boxesOverlap(elbowBox, wristBox)
      && !boxesOverlap(elbowBox, gripperBox)
      // The forearm box is trimmed before the wrist, so overlap here is a
      // genuine fold-back collision rather than the intended joint contact.
      && !boxesOverlap(forearmBox, gripperBox);
  }

  function graspCenter(geometry: ReturnType<typeof calculateArmGeometry>) {
    const radians = (geometry.toolAngle * Math.PI) / 180;
    return {
      x: geometry.wristX + Math.cos(radians) * graspCenterOffset,
      y: geometry.wristY + Math.sin(radians) * graspCenterOffset
    };
  }

  function debugCollisionBoxes(geometry: ReturnType<typeof calculateArmGeometry>) {
    const isLeft = geometry.baseX < 135;
    return [
      isLeft
        ? [{ x: 0, y: 190 }, { x: 50, y: 190 }, { x: 50, y: 330 }, { x: 0, y: 330 }]
        : [{ x: 220, y: 190 }, { x: 270, y: 190 }, { x: 270, y: 330 }, { x: 220, y: 330 }],
      segmentBox(geometry.baseX, geometry.baseY, geometry.elbowX, geometry.elbowY, 10, 23, 20),
      jointBox(geometry.elbowX, geometry.elbowY, 20),
      segmentBox(geometry.elbowX, geometry.elbowY, geometry.wristX, geometry.wristY, 10, 20, 17),
      jointBox(geometry.wristX, geometry.wristY, 18),
      transformedGripperBox(geometry)
    ];
  }

  const polygonPoints = (box: CollisionPoint[]) => box.map((point) => `${point.x},${point.y}`).join(' ');

  function chooseSafeMotion(
    currentPose: { upperRotation: number; forearmRotation: number; wristRotation: number },
    currentTool: number,
    solvedPoses: Array<{ upperRotation: number; forearmRotation: number; wristRotation: number; toolAngle: number }>,
    targetX: number,
    targetY: number,
    maximumSteps: { upper: number; forearm: number; tool: number },
    routingViaNeutral: boolean
  ) {
    const configurationDistance = (candidate: (typeof solvedPoses)[number]) =>
      Math.abs(normalizeAngle(candidate.upperRotation - currentPose.upperRotation))
      + Math.abs(normalizeAngle(candidate.forearmRotation - currentPose.forearmRotation))
      + 0.35 * Math.abs(normalizeAngle(candidate.toolAngle - currentTool));
    const targetScore = (candidate: (typeof solvedPoses)[number]) => {
      const geometry = calculateArmGeometry('right', candidate, targetX, targetY, candidate.toolAngle);
      const center = graspCenter(geometry);
      const trackingError = Math.hypot(center.x - targetX, center.y - targetY);
      return (geometryIsCollisionFree(geometry) ? 0 : 1_000_000)
        + trackingError * 10_000
        + configurationDistance(candidate);
    };
    const solvedPose = [...solvedPoses].sort((first, second) => targetScore(first) - targetScore(second))[0];
    const neutralPose = { upperRotation: 0, forearmRotation: 0, wristRotation: 0, toolAngle: 180 };
    const neutralError = configurationDistance(neutralPose);
    if (routingViaNeutral && neutralError < 4) routingViaNeutral = false;
    const destination = routingViaNeutral ? neutralPose : solvedPose;
    const upperError = normalizeAngle(destination.upperRotation - currentPose.upperRotation);
    const forearmError = normalizeAngle(destination.forearmRotation - currentPose.forearmRotation);
    const toolError = normalizeAngle(destination.toolAngle - currentTool);
    const step = {
      upper: clamp(upperError * 0.18, -maximumSteps.upper, maximumSteps.upper),
      forearm: clamp(forearmError * 0.18, -maximumSteps.forearm, maximumSteps.forearm),
      tool: clamp(toolError * 0.2, -maximumSteps.tool, maximumSteps.tool)
    };
    for (const fraction of [1, 0.75, 0.5, 0.25, 0.125]) {
      const pose = enforceSafePose('right', {
        upperRotation: currentPose.upperRotation + step.upper * fraction,
        forearmRotation: currentPose.forearmRotation + step.forearm * fraction,
        wristRotation: 0
      });
      const tool = currentTool + step.tool * fraction;
      const geometry = calculateArmGeometry('right', pose, targetX, targetY, tool);
      if (geometryIsCollisionFree(geometry)) {
        return { pose, tool, routingViaNeutral };
      }
    }
    // A direct interpolation can hit the base or the other links even when
    // the opposite analytical elbow branch is valid. Leave that local basin
    // through the known-safe, inward-facing extended posture, then approach
    // the globally best branch from there.
    if (!routingViaNeutral) {
      return chooseSafeMotion(currentPose, currentTool, solvedPoses, targetX, targetY, maximumSteps, true);
    }
    return { pose: currentPose, tool: currentTool, routingViaNeutral };
  }

  function buildEmgPath(samples: number[]) {
    return samples.map((sample, index) => {
      const x = (index / (samples.length - 1)) * 1200;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${(90 - sample).toFixed(2)}`;
    }).join(' ');
  }

  const motorUnitKernel = [0, -0.18, -0.82, 1, -0.46, 0.12, 0];

  function advanceEmgSignal() {
    const intensityResponse = targetEmgIntensity > emgIntensity ? 0.58 : 0.14;
    emgIntensity += (targetEmgIntensity - emgIntensity) * intensityResponse;

    if (Math.random() < 0.004 + emgIntensity * 0.48) {
      activeMotorUnits.push({
        age: 0,
        amplitude: 18 + emgIntensity * (30 + Math.random() * 24)
      });
    }

    // Fine, high-frequency resting activity; deliberate movement adds crisp motor-unit spikes.
    let sample = (Math.random() - 0.5) * 1.4;
    for (const unit of activeMotorUnits) {
      sample += motorUnitKernel[unit.age] * unit.amplitude;
      unit.age += 1;
    }
    activeMotorUnits = activeMotorUnits.filter((unit) => unit.age < motorUnitKernel.length);
    emgSamples = [...emgSamples.slice(1), sample];
  }

  function solveArm(side: 'left' | 'right', targetX: number, targetY: number) {
    const baseX = side === 'left' ? 45 : 225;
    const baseY = 260;
    const linkOne = 118.75;
    const linkTwo = 117.07;
    const baseAngleOne = side === 'left' ? 0 : 180;
    const baseAngleTwo = side === 'left' ? 0 : 180;

    const toolDirection = Math.atan2(targetY - baseY, targetX - baseX);
    // The grasp point is halfway through the open jaw, between its fixed
    // crossbar at x=30 and fingertip line at x=61.
    const toolCenterOffset = graspCenterOffset;
    const maximumReach = linkOne + linkTwo - 1;
    // Keep enough radial clearance that the forearm cannot fold back through
    // the upper arm when the cursor moves close to the shoulder.
    // Keep the wrist far enough from the shoulder/base that the complete
    // 61-by-64 open-gripper rectangle cannot overlap the proximal mechanism.
    const minimumReach = 92;
    const targetDistance = Math.hypot(targetX - baseX, targetY - baseY);
    const targetIsBeyondReach = targetDistance > maximumReach + toolCenterOffset;
    const wristTargetX = targetIsBeyondReach
      ? baseX + Math.cos(toolDirection) * maximumReach
      : targetX - Math.cos(toolDirection) * toolCenterOffset;
    const wristTargetY = targetIsBeyondReach
      ? baseY + Math.sin(toolDirection) * maximumReach
      : targetY - Math.sin(toolDirection) * toolCenterOffset;
    let dx = wristTargetX - baseX;
    let dy = wristTargetY - baseY;
    const distance = Math.hypot(dx, dy) || 1;

    if (distance > maximumReach) {
      dx = (dx / distance) * maximumReach;
      dy = (dy / distance) * maximumReach;
    }

    if (distance < minimumReach) {
      dx = (dx / distance) * minimumReach;
      dy = (dy / distance) * minimumReach;
    }

    const squaredDistance = dx * dx + dy * dy;
    const cosineElbow = clamp((squaredDistance - linkOne ** 2 - linkTwo ** 2) / (2 * linkOne * linkTwo), -1, 1);
    const desiredToolAngle = radiansToDegrees(toolDirection);
    return [-1, 1].map((elbowSign) => {
      const elbow = Math.acos(cosineElbow) * elbowSign;
      const shoulder = Math.atan2(dy, dx) - Math.atan2(linkTwo * Math.sin(elbow), linkOne + linkTwo * Math.cos(elbow));
      const forearm = shoulder + elbow;
      // Both elbow-up and elbow-down are genuine solutions. Normalizing them
      // makes the global selector compare equivalent configurations correctly.
      const upperRotation = normalizeAngle(radiansToDegrees(shoulder) - baseAngleOne);
      const forearmRotation = normalizeAngle(radiansToDegrees(forearm) - baseAngleTwo - upperRotation);
      const defaultToolAngle = side === 'left' ? 0 : 180;
      const rawWristRotation = desiredToolAngle - defaultToolAngle - upperRotation - forearmRotation;
      const wristRotation = clamp(normalizeAngle(rawWristRotation), -108, 108);
      return { upperRotation, forearmRotation, wristRotation, toolAngle: desiredToolAngle };
    });
  }

  $: emgPath = buildEmgPath(emgSamples);
  // The left mechanism is the proven right mechanism reflected across the
  // SVG centerline; it has no independent IK or collision behavior.
  $: leftGeometry = mirrorArmGeometry(calculateArmGeometry('right', leftPose, 270 - leftTargetX, leftTargetY, leftToolAngle));
  $: rightGeometry = calculateArmGeometry('right', rightPose, rightTargetX, rightTargetY, rightToolAngle);
  $: leftCollisionBoxes = debugCollisionBoxes(leftGeometry);
  $: rightCollisionBoxes = debugCollisionBoxes(rightGeometry);
  $: leftGraspCenter = graspCenter(leftGeometry);
  $: rightGraspCenter = graspCenter(rightGeometry);

  function advanceArms(timestamp = performance.now()) {
    const elapsedSeconds = previousArmTime === 0
      ? 1 / 60
      : clamp((timestamp - previousArmTime) / 1000, 1 / 240, 1 / 30);
    previousArmTime = timestamp;
    const maximumSteps = {
      upper: 175 * elapsedSeconds,
      forearm: 230 * elapsedSeconds,
      tool: 105 * elapsedSeconds
    };
    // A short refresh-rate-independent low-pass removes mouse-event quantizing
    // without making the mechanism feel detached from the cursor.
    const targetBlend = 1 - Math.exp(-elapsedSeconds / 0.035);
    leftTargetX += (desiredLeftTargetX - leftTargetX) * targetBlend;
    leftTargetY += (desiredLeftTargetY - leftTargetY) * targetBlend;
    rightTargetX += (desiredRightTargetX - rightTargetX) * targetBlend;
    rightTargetY += (desiredRightTargetY - rightTargetY) * targetBlend;

    const canonicalLeftTargetX = 270 - leftTargetX;
    const solvedLeft = solveArm('right', canonicalLeftTargetX, leftTargetY);
    const solvedRight = solveArm('right', rightTargetX, rightTargetY);
    const safeLeft = chooseSafeMotion(leftPose, leftToolAngle, solvedLeft, canonicalLeftTargetX, leftTargetY, maximumSteps, leftRoutingViaNeutral);
    const safeRight = chooseSafeMotion(rightPose, rightToolAngle, solvedRight, rightTargetX, rightTargetY, maximumSteps, rightRoutingViaNeutral);
    leftPose = safeLeft.pose;
    leftToolAngle = safeLeft.tool;
    leftRoutingViaNeutral = safeLeft.routingViaNeutral;
    rightPose = safeRight.pose;
    rightToolAngle = safeRight.tool;
    rightRoutingViaNeutral = safeRight.routingViaNeutral;

    armAnimationFrame = requestAnimationFrame(advanceArms);
  }

  onMount(() => {
    robotDebug = new URLSearchParams(window.location.search).get('robotDebug') !== '0';
    emgTimer = setInterval(advanceEmgSignal, 20);
    armAnimationFrame = requestAnimationFrame(advanceArms);
  });

  onDestroy(() => {
    clearTimeout(movementTimer);
    clearTimeout(gripTimer);
    clearInterval(emgTimer);
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(armAnimationFrame);
    }
  });
</script>

<section
  class="home-scene"
  on:pointermove={handlePointerMove}
  on:pointerleave={resetPointer}
  on:pointerdown={handleScenePress}
>
  <div class="grid-layer"></div>
  <div class="ambient-light"></div>

  <svg class="emg-layer" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="emg-gradient" x1="0" x2="1">
        <stop offset="0" stop-color="#00a9ff" stop-opacity="0" />
        <stop offset="0.18" stop-color="#00a9ff" />
        <stop offset="0.52" stop-color="#7566ff" />
        <stop offset="0.82" stop-color="#cf5fff" />
        <stop offset="1" stop-color="#cf5fff" stop-opacity="0" />
      </linearGradient>
      <filter id="emg-glow" x="-20%" y="-100%" width="140%" height="300%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g class="emg-guides">
      <path d="M0 45 H1200 M0 90 H1200 M0 135 H1200" />
      <path d="M120 20 V160 M360 20 V160 M600 20 V160 M840 20 V160 M1080 20 V160" />
    </g>
    <path class="emg-wave" class:moving={isMoving} d={emgPath} filter="url(#emg-glow)" />
  </svg>

  <svg bind:this={leftRobot} class="robot robot-left" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    {#if robotDebug}
      <defs><clipPath id="left-workspace-wall"><rect x="13" y="-400" width="657" height="1320" /></clipPath></defs>
      <g class="debug-workspace" clip-path="url(#left-workspace-wall)">
        <circle cx={leftGeometry.baseX} cy={leftGeometry.baseY} r="281.32" />
      </g>
    {/if}
    <g class="robot-mount">
      <path d="M8 190 V330 M8 225 H45 V295 H8" /><circle cx="45" cy="260" r="19" />
    </g>
    <g class="arm-segment">
      <path d={`M${leftGeometry.baseX} ${leftGeometry.baseY} L${leftGeometry.elbowX} ${leftGeometry.elbowY}`} />
      <circle cx={leftGeometry.elbowX} cy={leftGeometry.elbowY} r="16" />
      <path d={`M${leftGeometry.elbowX} ${leftGeometry.elbowY} L${leftGeometry.wristX} ${leftGeometry.wristY}`} />
      <circle cx={leftGeometry.wristX} cy={leftGeometry.wristY} r="14" />
    </g>
    <g class="wrist" transform={`translate(${leftGeometry.wristX} ${leftGeometry.wristY}) rotate(${leftGeometry.toolAngle})`}>
      <path class="gripper-base" d="M0 0 H30 M30 -28 V28" />
      <path class="gripper-finger finger-upper" d="M30 -28 H61" />
      <path class="gripper-finger finger-lower" d="M30 28 H61" />
    </g>
    {#if robotDebug}
      <g class="debug-target">
        <line x1={leftGraspCenter.x} y1={leftGraspCenter.y} x2={leftTargetX} y2={leftTargetY} />
        <circle cx={leftGraspCenter.x} cy={leftGraspCenter.y} r="5" />
        <circle class="mouse-point" cx={leftTargetX} cy={leftTargetY} r="3.5" />
      </g>
      <g class="debug-collision">
        {#each leftCollisionBoxes as box}<polygon points={polygonPoints(box)} />{/each}
      </g>
    {/if}
  </svg>

  <svg bind:this={rightRobot} class="robot robot-right" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    {#if robotDebug}
      <defs><clipPath id="right-workspace-wall"><rect x="-400" y="-400" width="657" height="1320" /></clipPath></defs>
      <g class="debug-workspace" clip-path="url(#right-workspace-wall)">
        <circle cx={rightGeometry.baseX} cy={rightGeometry.baseY} r="281.32" />
      </g>
    {/if}
    <g class="robot-mount">
      <path d="M262 190 V330 M262 225 H225 V295 H262" /><circle cx="225" cy="260" r="19" />
    </g>
    <g class="arm-segment">
      <path d={`M${rightGeometry.baseX} ${rightGeometry.baseY} L${rightGeometry.elbowX} ${rightGeometry.elbowY}`} />
      <circle cx={rightGeometry.elbowX} cy={rightGeometry.elbowY} r="16" />
      <path d={`M${rightGeometry.elbowX} ${rightGeometry.elbowY} L${rightGeometry.wristX} ${rightGeometry.wristY}`} />
      <circle cx={rightGeometry.wristX} cy={rightGeometry.wristY} r="14" />
    </g>
    <g class="wrist" transform={`translate(${rightGeometry.wristX} ${rightGeometry.wristY}) rotate(${rightGeometry.toolAngle})`}>
      <path class="gripper-base" d="M0 0 H30 M30 -28 V28" />
      <path class="gripper-finger finger-upper" d="M30 -28 H61" />
      <path class="gripper-finger finger-lower" d="M30 28 H61" />
    </g>
    {#if robotDebug}
      <g class="debug-target">
        <line x1={rightGraspCenter.x} y1={rightGraspCenter.y} x2={rightTargetX} y2={rightTargetY} />
        <circle cx={rightGraspCenter.x} cy={rightGraspCenter.y} r="5" />
        <circle class="mouse-point" cx={rightTargetX} cy={rightTargetY} r="3.5" />
      </g>
      <g class="debug-collision">
        {#each rightCollisionBoxes as box}<polygon points={polygonPoints(box)} />{/each}
      </g>
    {/if}
  </svg>

  <div class="identity">
    <p class="identity-kicker">Robotics · Biosignals · Human-Centered AI</p>
    <div class="name-row">
      <h1>Natey Kim</h1>
    </div>
    <p class="job-title">Human–Robot Interaction Research Engineer @ UPenn GRASP Lab</p>
  </div>

  <div class="bio-panel">
    {#each bio as paragraph}<p>{paragraph}</p>{/each}
  </div>
</section>

<style>
  .home-scene {
    position: relative;
    isolation: isolate;
    min-height: calc(100vh - 60px);
    padding: clamp(4rem, 9vh, 7rem) max(1rem, calc((100vw - 1200px) / 2)) 4rem;
    overflow: hidden;
    background: #f8fafc;
    color: #111820;
  }

  .home-scene::after {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 0;
    left: 0;
    height: 34%;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7) 55%, #fff 100%);
    content: '';
    pointer-events: none;
  }

  .grid-layer {
    position: absolute;
    z-index: -5;
    inset: 0;
    background-image: linear-gradient(rgba(55, 74, 99, 0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 74, 99, 0.11) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, black 0%, black 72%, rgba(0, 0, 0, 0.62) 91%, transparent 100%);
    transform: scale(1.04);
  }

  .ambient-light {
    position: absolute;
    z-index: -4;
    inset: 0;
    background: radial-gradient(circle at 50% 31%, rgba(255, 255, 255, 0.96) 0 10%, rgba(224, 231, 255, 0.7) 30%, transparent 53%), radial-gradient(circle at 20% 42%, rgba(0, 169, 255, 0.1), transparent 28%), radial-gradient(circle at 80% 42%, rgba(207, 95, 255, 0.09), transparent 28%);
  }

  .emg-layer {
    position: absolute;
    z-index: -1;
    top: 3rem;
    left: 0;
    width: 100%;
    height: clamp(7rem, 16vh, 10rem);
    pointer-events: none;
  }

  .emg-wave {
    fill: none;
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .emg-guides path {
    fill: none;
    stroke: rgba(83, 97, 116, 0.12);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .emg-wave {
    stroke: url(#emg-gradient);
    stroke-width: 2.2;
    opacity: 0.58;
    transition: opacity 120ms ease-out, stroke-width 120ms ease-out;
  }

  .emg-wave.moving {
    opacity: 0.94;
    stroke-width: 2.8;
  }

  .identity {
    position: relative;
    z-index: 3;
    width: min(780px, 100%);
    margin: clamp(10rem, 21vh, 14rem) auto clamp(13rem, 30vh, 22rem);
    text-align: center;
  }

  .identity-kicker {
    margin: 0 0 1rem;
    color: #536174;
    font-size: clamp(0.68rem, 1.5vw, 0.82rem);
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .name-row { display: flex; align-items: center; justify-content: center; gap: 1rem; }
  h1 { margin: 0; font-size: clamp(4rem, 10vw, 8rem); font-weight: 800; letter-spacing: -0.07em; line-height: 0.94; }
  .job-title { margin: 1.4rem 0 0; color: #394657; font-size: clamp(1.05rem, 2.2vw, 1.55rem); font-weight: 600; }

  .robot {
    --robot-width: clamp(180px, 22vw, 330px);
    position: absolute;
    z-index: 1;
    top: clamp(6rem, 13vh, 9rem);
    width: var(--robot-width);
    overflow: visible;
    opacity: 0.84;
    filter: drop-shadow(0 20px 26px rgba(25, 32, 50, 0.13));
  }
  /* The wall rail is x=8 in a 270-unit viewBox. Offset by that exact scaled
     amount so the physical mount, not the SVG box, sits on the viewport edge. */
  .robot-left { left: 0; transform: translateX(-2.963%); }
  .robot-right { right: 0; transform: translateX(2.963%); }
  .robot-mount path, .arm-segment path, .wrist path { fill: none; stroke: #222c38; stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }
  .robot-mount circle, .arm-segment circle { fill: #f8fafc; stroke: #222c38; stroke-width: 7; }
  .gripper-base { stroke-width: 8 !important; }
  .gripper-finger {
    stroke-width: 7 !important;
    transition: transform 150ms ease-in-out;
  }

  .debug-collision polygon {
    fill: rgba(255, 35, 35, 0.035);
    stroke: #ef2929;
    stroke-width: 1.7;
    vector-effect: non-scaling-stroke;
  }
  .debug-workspace circle {
    fill: none;
    stroke: #1688ff;
    stroke-width: 1.8;
    stroke-dasharray: 8 6;
    vector-effect: non-scaling-stroke;
  }
  .debug-target { pointer-events: none; }
  .debug-target line {
    stroke: #ff3fab;
    stroke-width: 1.8;
    stroke-dasharray: 4 5;
    vector-effect: non-scaling-stroke;
  }
  .debug-target circle {
    fill: #ff3fab;
    stroke: #fff;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }
  .debug-target .mouse-point { fill: #fff; stroke: #ff3fab; }

  .robot-left.gripping .finger-upper { transform: translateY(19px); }
  .robot-left.gripping .finger-lower { transform: translateY(-19px); }
  .robot-right.gripping .finger-upper { transform: translateY(19px); }
  .robot-right.gripping .finger-lower { transform: translateY(-19px); }

  .bio-panel {
    position: relative;
    z-index: 4;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: min(1200px, 100%);
    margin: 0 auto;
    padding: clamp(1.25rem, 3vw, 2rem);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 22px 60px rgba(32, 39, 63, 0.11);
    backdrop-filter: blur(18px);
  }
  .bio-panel p { margin: 0; font-size: clamp(1rem, 1.5vw, 1.12rem); line-height: 1.65; }

  @media (max-width: 850px) {
    .home-scene { padding-top: 2.5rem; padding-bottom: 2rem; }
    .identity { margin-top: 7rem; margin-bottom: 16rem; }
    .robot { --robot-width: 180px; top: 12rem; opacity: 0.34; }
    .bio-panel { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-scene *, .home-scene *::before, .home-scene *::after { animation: none !important; transition: none !important; }
  }
</style>
