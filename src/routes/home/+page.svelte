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
      // Keep the end effectors on opposite sides of the cursor so the arms
      // approach the target together without occupying the same task space.
      const collisionClearance = 38;
      desiredLeftTargetX = ((event.clientX - collisionClearance - leftRect.left) / leftRect.width) * 270;
      desiredLeftTargetY = ((event.clientY - leftRect.top) / leftRect.height) * 520 - 10;
      desiredRightTargetX = ((event.clientX + collisionClearance - rightRect.left) / rightRect.width) * 270;
      desiredRightTargetY = ((event.clientY - rightRect.top) / rightRect.height) * 520 + 10;
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
    const gripperClearance = 46;
    const constrainedTargetY = Math.min(targetY, floorY - gripperClearance);

    const toolDirection = Math.atan2(constrainedTargetY - baseY, targetX - baseX);
    const toolCenterOffset = 55;
    const wristTargetX = targetX - Math.cos(toolDirection) * toolCenterOffset;
    const wristTargetY = constrainedTargetY - Math.sin(toolDirection) * toolCenterOffset;
    let dx = wristTargetX - baseX;
    let dy = wristTargetY - baseY;
    const maximumReach = linkOne + linkTwo - 1;
    const minimumReach = Math.abs(linkOne - linkTwo) + 18;
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
    const shoulder = Math.atan2(dy, dx) - Math.atan2(linkTwo * Math.sin(elbow), linkOne + linkTwo * Math.cos(elbow));
    const forearm = shoulder + elbow;
    const upperRotation = radiansToDegrees(shoulder) - baseAngleOne;
    const forearmRotation = radiansToDegrees(forearm) - baseAngleTwo - upperRotation;
    const desiredToolAngle = radiansToDegrees(toolDirection);
    const defaultToolAngle = side === 'left' ? 0 : 180;
    const rawWristRotation = desiredToolAngle - defaultToolAngle - upperRotation - forearmRotation;
    const normalizedWristRotation = ((rawWristRotation + 540) % 360) - 180;
    const wristRotation = clamp(normalizedWristRotation, -155, 155);

    return { upperRotation, forearmRotation, wristRotation };
  }

  $: emgPath = buildEmgPath(emgSamples);

  function advanceArms() {
    // Target-space slew limits prevent pointer jumps from demanding impossible Cartesian velocities.
    leftTargetX = moveToward(leftTargetX, desiredLeftTargetX, 6.875);
    leftTargetY = moveToward(leftTargetY, desiredLeftTargetY, 6.875);
    rightTargetX = moveToward(rightTargetX, desiredRightTargetX, 6.875);
    rightTargetY = moveToward(rightTargetY, desiredRightTargetY, 6.875);

    const solvedLeft = solveArm('left', leftTargetX, leftTargetY);
    const solvedRight = solveArm('right', rightTargetX, rightTargetY);

    // Per-joint velocity limits keep the mechanism continuous near IK boundaries.
    leftPose = {
      upperRotation: moveAngleToward(leftPose.upperRotation, solvedLeft.upperRotation, 2.625),
      forearmRotation: moveAngleToward(leftPose.forearmRotation, solvedLeft.forearmRotation, 3.5),
      wristRotation: moveAngleToward(leftPose.wristRotation, solvedLeft.wristRotation, 4.25)
    };
    rightPose = {
      upperRotation: moveAngleToward(rightPose.upperRotation, solvedRight.upperRotation, 2.625),
      forearmRotation: moveAngleToward(rightPose.forearmRotation, solvedRight.forearmRotation, 3.5),
      wristRotation: moveAngleToward(rightPose.wristRotation, solvedRight.wristRotation, 4.25)
    };

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
    <g class="arm-segment" style={`transform: rotate(${leftPose.upperRotation}deg); transform-origin: 62px 416px;`}>
      <path d="M62 416 L126 316" /><circle cx="126" cy="316" r="16" />
      <g class="arm-segment" style={`transform: rotate(${leftPose.forearmRotation}deg); transform-origin: 126px 316px;`}>
        <path d="M126 316 L190 218" /><circle cx="190" cy="218" r="14" />
        <g class="wrist" style={`transform: rotate(${leftPose.wristRotation}deg); transform-origin: 190px 218px;`}>
          <path class="gripper-base" d="M190 218 H220 M220 190 V246" />
          <path class="gripper-finger finger-upper" d="M220 190 H251" />
          <path class="gripper-finger finger-lower" d="M220 246 H251" />
        </g>
      </g>
    </g>
  </svg>

  <svg bind:this={rightRobot} class="robot robot-right" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    <g class="robot-mount">
      <path d="M152 450 H262 M178 450 V420 H238 V450" /><circle cx="208" cy="416" r="19" />
    </g>
    <g class="arm-segment" style={`transform: rotate(${rightPose.upperRotation}deg); transform-origin: 208px 416px;`}>
      <path d="M208 416 L144 316" /><circle cx="144" cy="316" r="16" />
      <g class="arm-segment" style={`transform: rotate(${rightPose.forearmRotation}deg); transform-origin: 144px 316px;`}>
        <path d="M144 316 L80 218" /><circle cx="80" cy="218" r="14" />
        <g class="wrist" style={`transform: rotate(${rightPose.wristRotation}deg); transform-origin: 80px 218px;`}>
          <path class="gripper-base" d="M80 218 H50 M50 190 V246" />
          <path class="gripper-finger finger-upper" d="M50 190 H19" />
          <path class="gripper-finger finger-lower" d="M50 246 H19" />
        </g>
      </g>
    </g>
  </svg>

  <div class="identity">
    <p class="identity-kicker">Robotics · Biosignals · Human-Centered AI</p>
    <div class="name-row">
      <h1>Natey Kim</h1>
    </div>
    <p class="job-title">Human–Robot Interaction Research Engineer @ UPenn GRASP Lab</p>
  </div>

  <div class="neural-transition" aria-hidden="true">
    <svg viewBox="0 0 1200 420" preserveAspectRatio="none">
      <g class="neural-lines">
        <path d="M0 250 L120 188 L245 260 L355 174 L478 244 L600 148 L724 238 L848 172 L976 252 L1090 184 L1200 246" />
        <path d="M55 330 L120 188 L278 330 M245 260 L355 174 L410 330 M478 244 L600 148 L655 330 M724 238 L848 172 L905 330 M976 252 L1090 184 L1150 330" />
        <path d="M0 292 L245 260 L478 244 L724 238 L976 252 L1200 286" />
        <path d="M120 188 L355 174 L600 148 L848 172 L1090 184" />
        <path d="M55 330 L180 380 L278 330 L410 386 L655 330 L782 388 L905 330 L1040 382 L1150 330" />
        <path d="M245 260 L180 380 M478 244 L410 386 M724 238 L782 388 M976 252 L1040 382" />
      </g>
      <g class="neural-nodes">
        <circle cx="120" cy="188" r="7" /><circle cx="245" cy="260" r="5" />
        <circle cx="355" cy="174" r="7" /><circle cx="478" cy="244" r="5" />
        <circle cx="600" cy="148" r="9" /><circle cx="724" cy="238" r="5" />
        <circle cx="848" cy="172" r="7" /><circle cx="976" cy="252" r="5" />
        <circle cx="1090" cy="184" r="7" />
        <circle cx="55" cy="330" r="4" /><circle cx="180" cy="380" r="3" /><circle cx="278" cy="330" r="4" />
        <circle cx="410" cy="386" r="3" /><circle cx="655" cy="330" r="4" /><circle cx="782" cy="388" r="3" />
        <circle cx="905" cy="330" r="4" /><circle cx="1040" cy="382" r="3" /><circle cx="1150" cy="330" r="4" />
      </g>
    </svg>
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
    mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 91%);
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
    width: clamp(180px, 22vw, 330px);
    overflow: visible;
    opacity: 0.84;
    filter: drop-shadow(0 20px 26px rgba(25, 32, 50, 0.13));
  }
  .robot-left { left: max(-4rem, calc((100vw - 1500px) / 2)); }
  .robot-right { right: max(-4rem, calc((100vw - 1500px) / 2)); }
  .robot-mount path, .arm-segment path { fill: none; stroke: #222c38; stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }
  .robot-mount circle, .arm-segment circle { fill: #f8fafc; stroke: #222c38; stroke-width: 7; }
  .arm-segment { transition: transform 128ms cubic-bezier(0.2, 0.75, 0.25, 1); }
  .wrist { transition: transform 98ms cubic-bezier(0.2, 0.75, 0.25, 1); }
  .gripper-base { stroke-width: 8 !important; }
  .gripper-finger {
    stroke-width: 7 !important;
    transition: transform 150ms ease-in-out;
  }

  .robot-left.gripping .finger-upper { transform: translateY(19px); }
  .robot-left.gripping .finger-lower { transform: translateY(-19px); }
  .robot-right.gripping .finger-upper { transform: translateY(19px); }
  .robot-right.gripping .finger-lower { transform: translateY(-19px); }

  .neural-transition {
    position: absolute;
    z-index: -2;
    right: 0;
    bottom: -3rem;
    left: 0;
    height: 500px;
    background: linear-gradient(to bottom, transparent, rgba(233, 237, 250, 0.58) 38%, rgba(247, 249, 253, 0.7) 72%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 17%, black 63%, rgba(0, 0, 0, 0.48) 81%, transparent 100%);
  }
  .neural-transition svg { width: 100%; height: 100%; }
  .neural-lines path { fill: none; stroke: #7b849c; stroke-width: 1.2; opacity: 0.36; vector-effect: non-scaling-stroke; }
  .neural-nodes circle {
    fill: #7566ff;
    stroke: #f8fafc;
    stroke-width: 3;
    animation: neural-pulse 3.4s ease-in-out infinite alternate;
    transform-box: fill-box;
    transform-origin: center;
  }
  .neural-nodes circle:nth-child(2n) { animation-delay: -1.1s; }
  .neural-nodes circle:nth-child(3n) { animation-delay: -2.2s; }

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

  @keyframes neural-pulse { to { fill: #16aaf3; opacity: 0.55; transform: scale(1.5); } }

  @media (max-width: 850px) {
    .home-scene { padding-top: 2.5rem; padding-bottom: 2rem; }
    .identity { margin-top: 7rem; margin-bottom: 16rem; }
    .robot { top: 12rem; width: 180px; opacity: 0.34; }
    .robot-left { left: -6rem; }
    .robot-right { right: -6rem; }
    .bio-panel { grid-template-columns: 1fr; }
    .neural-transition { bottom: -2rem; height: 660px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-scene *, .home-scene *::before, .home-scene *::after { animation: none !important; transition: none !important; }
  }
</style>
