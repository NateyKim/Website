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
  let armAnimationFrame = 0;

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
  const moveToward = (current: number, target: number, maximumStep: number) => current + clamp(target - current, -maximumStep, maximumStep);

  function moveAngleToward(current: number, target: number, maximumStep: number) {
    const difference = ((target - current + 540) % 360) - 180;
    return current + clamp(difference, -maximumStep, maximumStep);
  }

  function enforceSafePose(
    side: 'left' | 'right',
    pose: { upperRotation: number; forearmRotation: number; wristRotation: number }
  ) {
    const baseAngleOne = side === 'left' ? -57.38 : -122.62;
    const baseAngleTwo = side === 'left' ? -56.84 : -123.16;
    const highestDownwardLinkAngle = -12;

    // These are hard per-frame limits, not merely IK target limits. Therefore
    // interpolation can never render either link on the floor side of a base.
    const upperRotation = Math.min(pose.upperRotation, highestDownwardLinkAngle - baseAngleOne);
    const maximumForearmRotation = highestDownwardLinkAngle - baseAngleTwo - upperRotation;
    const forearmRotation = Math.min(pose.forearmRotation, maximumForearmRotation);

    // Keep the pinch tool from folding backward into its own forearm.
    const wristRotation = clamp(pose.wristRotation, -35, 35);
    return { upperRotation, forearmRotation, wristRotation };
  }

  function calculateArmGeometry(
    side: 'left' | 'right',
    pose: { upperRotation: number; forearmRotation: number; wristRotation: number }
  ) {
    const baseX = side === 'left' ? 62 : 208;
    const baseY = 416;
    const linkOne = 118.75;
    const linkTwo = 117.07;
    const baseAngleOne = side === 'left' ? -57.38 : -122.62;
    const baseAngleTwo = side === 'left' ? -56.84 : -123.16;
    const shoulderAngle = ((baseAngleOne + pose.upperRotation) * Math.PI) / 180;
    const forearmAngle = ((baseAngleTwo + pose.upperRotation + pose.forearmRotation) * Math.PI) / 180;
    const elbowX = baseX + Math.cos(shoulderAngle) * linkOne;
    const elbowY = baseY + Math.sin(shoulderAngle) * linkOne;
    const wristX = elbowX + Math.cos(forearmAngle) * linkTwo;
    const wristY = elbowY + Math.sin(forearmAngle) * linkTwo;
    const defaultToolAngle = side === 'left' ? 0 : 180;
    const desiredToolAngle = defaultToolAngle + pose.upperRotation + pose.forearmRotation + pose.wristRotation;
    const angleDifference = ((desiredToolAngle - defaultToolAngle + 540) % 360) - 180;
    const toolCorners = [[30, -28], [30, 28], [61, -28], [61, 28]];
    const toolBottom = (angle: number) => {
      const radians = (angle * Math.PI) / 180;
      return wristY + Math.max(...toolCorners.map(([x, y]) => x * Math.sin(radians) + y * Math.cos(radians)));
    };

    // The horizontal tool pose is always safe. Move toward the requested pose
    // only as far as the complete gripper geometry remains above the floor.
    let safeFraction = 0;
    let unsafeFraction = 1;
    if (toolBottom(desiredToolAngle) <= 442) {
      safeFraction = 1;
    } else {
      for (let iteration = 0; iteration < 12; iteration += 1) {
        const candidate = (safeFraction + unsafeFraction) / 2;
        if (toolBottom(defaultToolAngle + angleDifference * candidate) <= 442) safeFraction = candidate;
        else unsafeFraction = candidate;
      }
    }
    const toolAngle = defaultToolAngle + angleDifference * safeFraction;

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
    const baseX = side === 'left' ? 62 : 208;
    const baseY = 416;
    const linkOne = 118.75;
    const linkTwo = 117.07;
    const baseAngleOne = side === 'left' ? -57.38 : -122.62;
    const baseAngleTwo = side === 'left' ? -56.84 : -123.16;
    const floorY = 450;
    // Clearance includes the rotated fingers, keeping the complete tool above
    // the invisible floor rather than constraining only its center point.
    const gripperClearance = 82;
    const constrainedTargetY = Math.min(targetY, floorY - gripperClearance);

    const toolDirection = Math.atan2(constrainedTargetY - baseY, targetX - baseX);
    // The grasp point is the center between the fingertips at x = 61.
    const toolCenterOffset = 61;
    const maximumReach = linkOne + linkTwo - 1;
    // Keep enough radial clearance that the forearm cannot fold back through
    // the upper arm when the cursor moves close to the shoulder.
    const minimumReach = 66;
    const targetDistance = Math.hypot(targetX - baseX, constrainedTargetY - baseY);
    const targetIsBeyondReach = targetDistance > maximumReach + toolCenterOffset;
    const wristTargetX = targetIsBeyondReach
      ? baseX + Math.cos(toolDirection) * maximumReach
      : targetX - Math.cos(toolDirection) * toolCenterOffset;
    const wristTargetY = targetIsBeyondReach
      ? baseY + Math.sin(toolDirection) * maximumReach
      : constrainedTargetY - Math.sin(toolDirection) * toolCenterOffset;
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
    const elbow = Math.acos(cosineElbow) * (side === 'left' ? 1 : -1);
    const solvedShoulder = Math.atan2(dy, dx) - Math.atan2(linkTwo * Math.sin(elbow), linkOne + linkTwo * Math.cos(elbow));
    // In screen coordinates, positive shoulder angles point below the base.
    // Clamp the shoulder itself so the elbow and upper arm cannot bow through
    // the invisible floor when the pointer is below the robot.
    const shoulder = Math.min(solvedShoulder, -0.1);
    const forearm = Math.min(shoulder + elbow, -0.05);
    const upperRotation = radiansToDegrees(shoulder) - baseAngleOne;
    const forearmRotation = radiansToDegrees(forearm) - baseAngleTwo - upperRotation;
    const desiredToolAngle = radiansToDegrees(toolDirection);
    const defaultToolAngle = side === 'left' ? 0 : 180;
    const rawWristRotation = desiredToolAngle - defaultToolAngle - upperRotation - forearmRotation;
    const normalizedWristRotation = ((rawWristRotation + 540) % 360) - 180;
    // Prevent the gripper from rotating back into its own forearm.
    const wristRotation = clamp(normalizedWristRotation, -108, 108);

    return { upperRotation, forearmRotation, wristRotation };
  }

  $: emgPath = buildEmgPath(emgSamples);
  // The left mechanism is the proven right mechanism reflected across the
  // SVG centerline; it has no independent IK or collision behavior.
  $: leftGeometry = mirrorArmGeometry(calculateArmGeometry('right', leftPose));
  $: rightGeometry = calculateArmGeometry('right', rightPose);

  function advanceArms() {
    // Target-space slew limits prevent pointer jumps from demanding impossible Cartesian velocities.
    leftTargetX = moveToward(leftTargetX, desiredLeftTargetX, 28);
    leftTargetY = moveToward(leftTargetY, desiredLeftTargetY, 28);
    rightTargetX = moveToward(rightTargetX, desiredRightTargetX, 28);
    rightTargetY = moveToward(rightTargetY, desiredRightTargetY, 28);

    const solvedLeft = solveArm('right', 270 - leftTargetX, leftTargetY);
    const solvedRight = solveArm('right', rightTargetX, rightTargetY);

    // Per-joint velocity limits keep the mechanism continuous near IK boundaries.
    leftPose = enforceSafePose('right', {
      upperRotation: moveAngleToward(leftPose.upperRotation, solvedLeft.upperRotation, 10),
      forearmRotation: moveAngleToward(leftPose.forearmRotation, solvedLeft.forearmRotation, 14),
      wristRotation: moveAngleToward(leftPose.wristRotation, solvedLeft.wristRotation, 18)
    });
    rightPose = enforceSafePose('right', {
      upperRotation: moveAngleToward(rightPose.upperRotation, solvedRight.upperRotation, 10),
      forearmRotation: moveAngleToward(rightPose.forearmRotation, solvedRight.forearmRotation, 14),
      wristRotation: moveAngleToward(rightPose.wristRotation, solvedRight.wristRotation, 18)
    });

    armAnimationFrame = requestAnimationFrame(advanceArms);
  }

  onMount(() => {
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
    <g class="robot-mount">
      <path d="M8 450 H118 M32 450 V420 H92 V450" /><circle cx="62" cy="416" r="19" />
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
  </svg>

  <svg bind:this={rightRobot} class="robot robot-right" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    <g class="robot-mount">
      <path d="M152 450 H262 M178 450 V420 H238 V450" /><circle cx="208" cy="416" r="19" />
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
    position: absolute;
    z-index: 1;
    top: clamp(6rem, 13vh, 9rem);
    width: clamp(220px, 28vw, 430px);
    overflow: visible;
    opacity: 0.84;
    filter: drop-shadow(0 20px 26px rgba(25, 32, 50, 0.13));
  }
  .robot-left { left: clamp(3rem, calc((100vw - 1200px) / 2), 9rem); }
  .robot-right { right: clamp(3rem, calc((100vw - 1200px) / 2), 9rem); }
  .robot-mount path, .arm-segment path, .wrist path { fill: none; stroke: #222c38; stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }
  .robot-mount circle, .arm-segment circle { fill: #f8fafc; stroke: #222c38; stroke-width: 7; }
  .gripper-base { stroke-width: 8 !important; }
  .gripper-finger {
    stroke-width: 7 !important;
    transition: transform 150ms ease-in-out;
  }

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
    .robot { top: 12rem; width: 180px; opacity: 0.34; }
    .robot-left { left: -6rem; }
    .robot-right { right: -6rem; }
    .bio-panel { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-scene *, .home-scene *::before, .home-scene *::after { animation: none !important; transition: none !important; }
  }
</style>
