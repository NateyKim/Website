<script lang="ts">
  import { onDestroy } from 'svelte';

  const bio = [
    'I am a research engineer at Penn’s GRASP Laboratory working at the intersection of assistive robotics, human movement, and human–robot interaction. I earned an M.S.E. in Robotics and a B.S.E. in Bioengineering from the University of Pennsylvania.',
    'My research spans upper-limb exoskeletons, EMG-informed musculoskeletal digital twins, human-in-the-loop control, machine learning for injury assessment, and socially assistive robots. I build systems that translate neuromuscular intent into adaptive, intuitive, and clinically meaningful technologies.',
    'Alongside my work at Penn, I am a research resident at Maingen, where I study machine-learning methods for robotic end-effector design, and a founding mechanical engineer at Tadashi Robotics, where I am helping translate the Ember social-robotics platform into a rehabilitative product.'
  ];

  let pointerX = 0;
  let pointerY = 0;
  let isMoving = false;
  let emgIntensity = 0;
  let signalPhase = 0;
  let gripping = false;
  let previousPointerX = 0;
  let previousPointerY = 0;
  let previousMoveTime = 0;
  let movementTimer: ReturnType<typeof setTimeout>;
  let gripTimer: ReturnType<typeof setTimeout>;

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
    emgIntensity = clamp(0.22 + velocity * 0.3, 0.22, 1);
    signalPhase += 0.65 + emgIntensity * 0.7;
    isMoving = true;
    clearTimeout(movementTimer);
    movementTimer = setTimeout(() => {
      isMoving = false;
      emgIntensity = 0;
    }, 130);
  }

  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
    isMoving = false;
    emgIntensity = 0;
  }

  function handleScenePress(event: PointerEvent) {
    if ((event.target as HTMLElement).closest('a')) return;
    gripping = true;
    clearTimeout(gripTimer);
    gripTimer = setTimeout(() => (gripping = false), 420);
  }

  const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
  const radiansToDegrees = (value: number) => (value * 180) / Math.PI;

  function buildEmgPath(intensity: number, phase: number) {
    const points = [];
    for (let x = 0; x <= 1200; x += 10) {
      const noise = Math.sin(x * 0.18 + phase * 2.1) + 0.56 * Math.sin(x * 0.43 - phase) + 0.28 * Math.sin(x * 0.76 + phase * 1.7);
      const envelope = 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(x * 0.031 + phase * 0.72)), 4);
      const y = 90 - noise * envelope * intensity * 18;
      points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(2)}`);
    }
    return points.join(' ');
  }

  function solveArm(side: 'left' | 'right', x: number, y: number) {
    const baseX = side === 'left' ? 62 : 208;
    const baseY = 416;
    const linkOne = 118.75;
    const linkTwo = 117.07;
    const baseAngleOne = side === 'left' ? -57.38 : -122.62;
    const baseAngleTwo = side === 'left' ? -56.84 : -123.16;

    // Broad, overlapping workspaces let both arms approach the pointer while reach limiting prevents singular poses.
    const targetX = side === 'left'
      ? clamp(70 + ((x + 1) / 2) * 220, 70, 290)
      : clamp(((x + 1) / 2) * 220, 0, 220);
    const targetY = clamp(170 + y * 160, 20, 350);
    let dx = targetX - baseX;
    let dy = targetY - baseY;
    const maximumReach = linkOne + linkTwo - 1;
    const distance = Math.hypot(dx, dy);

    if (distance > maximumReach) {
      dx = (dx / distance) * maximumReach;
      dy = (dy / distance) * maximumReach;
    }

    const squaredDistance = dx * dx + dy * dy;
    const cosineElbow = clamp((squaredDistance - linkOne ** 2 - linkTwo ** 2) / (2 * linkOne * linkTwo), -1, 1);
    const elbow = Math.acos(cosineElbow) * (side === 'left' ? 1 : -1);
    const shoulder = Math.atan2(dy, dx) - Math.atan2(linkTwo * Math.sin(elbow), linkOne + linkTwo * Math.cos(elbow));
    const forearm = shoulder + elbow;
    const upperRotation = radiansToDegrees(shoulder) - baseAngleOne;
    const forearmRotation = radiansToDegrees(forearm) - baseAngleTwo - upperRotation;
    const desiredToolAngle = side === 'left' ? y * 42 : 180 - y * 42;
    const defaultToolAngle = side === 'left' ? 0 : 180;
    const wristRotation = clamp(desiredToolAngle - defaultToolAngle - upperRotation - forearmRotation, -90, 90);

    return { upperRotation, forearmRotation, wristRotation };
  }

  $: emgPath = buildEmgPath(emgIntensity, signalPhase);
  $: leftPose = solveArm('left', pointerX, pointerY);
  $: rightPose = solveArm('right', pointerX, pointerY);

  onDestroy(() => {
    clearTimeout(movementTimer);
    clearTimeout(gripTimer);
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
    <path class="emg-baseline" d="M0 90 H1200" />
    <path class="emg-wave" class:moving={isMoving} d={emgPath} filter="url(#emg-glow)" />
  </svg>

  <svg class="robot robot-left" class:gripping viewBox="0 0 270 520" aria-hidden="true">
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

  <svg class="robot robot-right" class:gripping viewBox="0 0 270 520" aria-hidden="true">
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
    <svg viewBox="0 0 1200 330" preserveAspectRatio="none">
      <g class="neural-lines">
        <path d="M0 250 L120 188 L245 260 L355 174 L478 244 L600 148 L724 238 L848 172 L976 252 L1090 184 L1200 246" />
        <path d="M55 330 L120 188 L278 330 M245 260 L355 174 L410 330 M478 244 L600 148 L655 330 M724 238 L848 172 L905 330 M976 252 L1090 184 L1150 330" />
        <path d="M0 292 L245 260 L478 244 L724 238 L976 252 L1200 286" />
        <path d="M120 188 L355 174 L600 148 L848 172 L1090 184" />
      </g>
      <g class="neural-nodes">
        <circle cx="120" cy="188" r="7" /><circle cx="245" cy="260" r="5" />
        <circle cx="355" cy="174" r="7" /><circle cx="478" cy="244" r="5" />
        <circle cx="600" cy="148" r="9" /><circle cx="724" cy="238" r="5" />
        <circle cx="848" cy="172" r="7" /><circle cx="976" cy="252" r="5" />
        <circle cx="1090" cy="184" r="7" />
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

  .emg-baseline,
  .emg-wave {
    fill: none;
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .emg-baseline {
    stroke: rgba(83, 97, 116, 0.28);
    stroke-width: 1.5;
  }

  .emg-wave {
    stroke: url(#emg-gradient);
    stroke-width: 3;
    opacity: 0;
    transition: opacity 90ms ease-out;
  }

  .emg-wave.moving {
    opacity: 0.92;
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
  .arm-segment { transition: transform 170ms cubic-bezier(0.2, 0.75, 0.25, 1); }
  .wrist { transition: transform 130ms cubic-bezier(0.2, 0.75, 0.25, 1); }
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
    bottom: 0;
    left: 0;
    height: 390px;
    background: linear-gradient(to bottom, transparent, rgba(233, 237, 250, 0.68) 44%, rgba(255, 255, 255, 0.88));
    mask-image: linear-gradient(to bottom, transparent 0%, black 22%, black 68%, transparent 100%);
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
    .neural-transition { height: 610px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-scene *, .home-scene *::before, .home-scene *::after { animation: none !important; transition: none !important; }
  }
</style>
