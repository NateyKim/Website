<script lang="ts">
  import { onDestroy } from 'svelte';

  const bio = [
    'I am a research engineer at Penn’s GRASP Laboratory working at the intersection of assistive robotics, human movement, and human–robot interaction. I earned an M.S.E. in Robotics and a B.S.E. in Bioengineering from the University of Pennsylvania.',
    'My research spans upper-limb exoskeletons, EMG-informed musculoskeletal digital twins, human-in-the-loop control, machine learning for injury assessment, and socially assistive robots. I build systems that translate neuromuscular intent into adaptive, intuitive, and clinically meaningful technologies.',
    'Alongside my work at Penn, I am a research resident at Maingen, where I study machine-learning methods for robotic end-effector design, and a founding mechanical engineer at Tadashi Robotics, where I am helping translate the Ember social-robotics platform into a rehabilitative product.'
  ];

  let pointerX = 0;
  let pointerY = 0;
  let pulseVersion = 0;
  let waveVisible = false;
  let gripping = false;
  let lastPulse = 0;
  let waveTimer: ReturnType<typeof setTimeout>;
  let gripTimer: ReturnType<typeof setTimeout>;

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));

    const now = performance.now();
    if (now - lastPulse > 700) {
      lastPulse = now;
      pulseVersion += 1;
      waveVisible = true;
      clearTimeout(waveTimer);
      waveTimer = setTimeout(() => (waveVisible = false), 1050);
    }
  }

  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
  }

  function handleScenePress(event: PointerEvent) {
    if ((event.target as HTMLElement).closest('a')) return;
    gripping = true;
    clearTimeout(gripTimer);
    gripTimer = setTimeout(() => (gripping = false), 420);
  }

  $: leftUpperAngle = -14 + pointerX * 9 + pointerY * 5;
  $: leftForearmAngle = 14 + pointerX * 12 - pointerY * 8;
  $: rightUpperAngle = 14 + pointerX * 9 - pointerY * 5;
  $: rightForearmAngle = -14 + pointerX * 12 + pointerY * 8;

  onDestroy(() => {
    clearTimeout(waveTimer);
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

  <svg class="emg-layer" viewBox="0 0 1200 620" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="emg-gradient" x1="0" x2="1">
        <stop offset="0" stop-color="#00a9ff" stop-opacity="0" />
        <stop offset="0.18" stop-color="#00a9ff" />
        <stop offset="0.52" stop-color="#7566ff" />
        <stop offset="0.82" stop-color="#cf5fff" />
        <stop offset="1" stop-color="#cf5fff" stop-opacity="0" />
      </linearGradient>
      <filter id="emg-glow" x="-20%" y="-100%" width="140%" height="300%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {#if waveVisible}
      {#key pulseVersion}
        <path
          class="emg-wave"
          d="M0 278 H430 L455 278 L474 265 L492 293 L510 244 L530 326 L550 168 L572 386 L594 228 L616 304 L638 260 L662 278 H1200"
          filter="url(#emg-glow)"
        />
      {/key}
    {/if}
  </svg>

  <svg class="robot robot-left" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    <g class="robot-mount">
      <path d="M8 450 H118 M32 450 V420 H92 V450" /><circle cx="62" cy="416" r="19" />
    </g>
    <g class="arm-segment" style={`transform: rotate(${leftUpperAngle}deg); transform-origin: 62px 416px;`}>
      <path d="M62 416 L126 316" /><circle cx="126" cy="316" r="16" />
      <g class="arm-segment" style={`transform: rotate(${leftForearmAngle}deg); transform-origin: 126px 316px;`}>
        <path d="M126 316 L190 218" /><circle cx="190" cy="218" r="14" />
        <path class="gripper-finger finger-upper" d="M190 218 L226 183 L247 170" />
        <path class="gripper-finger finger-lower" d="M190 218 L236 225 L258 230" />
      </g>
    </g>
    <circle class="joint-pulse pulse-a" cx="62" cy="416" r="29" />
    <circle class="joint-pulse pulse-b" cx="126" cy="316" r="25" />
  </svg>

  <svg class="robot robot-right" class:gripping viewBox="0 0 270 520" aria-hidden="true">
    <g class="robot-mount">
      <path d="M152 450 H262 M178 450 V420 H238 V450" /><circle cx="208" cy="416" r="19" />
    </g>
    <g class="arm-segment" style={`transform: rotate(${rightUpperAngle}deg); transform-origin: 208px 416px;`}>
      <path d="M208 416 L144 316" /><circle cx="144" cy="316" r="16" />
      <g class="arm-segment" style={`transform: rotate(${rightForearmAngle}deg); transform-origin: 144px 316px;`}>
        <path d="M144 316 L80 218" /><circle cx="80" cy="218" r="14" />
        <path class="gripper-finger finger-upper" d="M80 218 L44 183 L23 170" />
        <path class="gripper-finger finger-lower" d="M80 218 L34 225 L12 230" />
      </g>
    </g>
    <circle class="joint-pulse pulse-a" cx="208" cy="416" r="29" />
    <circle class="joint-pulse pulse-b" cx="144" cy="316" r="25" />
  </svg>

  <div class="identity">
    <p class="identity-kicker">Robotics · Biosignals · Human-Centered AI</p>
    <div class="name-row">
      <h1>Natey Kim</h1>
      <a class="linkedin-link" href="https://www.linkedin.com/in/nateykim" target="_blank" rel="noreferrer" aria-label="Visit Natey Kim’s LinkedIn profile" title="LinkedIn">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
        </svg>
      </a>
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
    top: 0;
    left: 0;
    width: 100%;
    height: min(66vh, 620px);
    pointer-events: none;
  }

  .emg-wave {
    fill: none;
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .emg-wave {
    stroke: url(#emg-gradient);
    stroke-width: 4;
    stroke-dasharray: 1500;
    animation: ekg-pulse 1s ease-out forwards;
  }

  .identity {
    position: relative;
    z-index: 3;
    width: min(780px, 100%);
    margin: clamp(5rem, 14vh, 10rem) auto clamp(13rem, 30vh, 22rem);
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

  .linkedin-link {
    display: inline-flex;
    width: clamp(1.8rem, 3.5vw, 2.5rem);
    height: clamp(1.8rem, 3.5vw, 2.5rem);
    color: #0a66c2;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
  .linkedin-link:hover, .linkedin-link:focus-visible { opacity: 0.78; transform: translateY(-3px); }
  .linkedin-link svg { width: 100%; height: 100%; fill: currentColor; }

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
  .gripper-finger {
    stroke-width: 7 !important;
    transition: transform 150ms ease-in-out;
  }

  .robot-left .gripper-finger { transform-origin: 190px 218px; }
  .robot-right .gripper-finger { transform-origin: 80px 218px; }
  .robot-left.gripping .finger-upper { transform: rotate(19deg); }
  .robot-left.gripping .finger-lower { transform: rotate(-16deg); }
  .robot-right.gripping .finger-upper { transform: rotate(-19deg); }
  .robot-right.gripping .finger-lower { transform: rotate(16deg); }

  .joint-pulse {
    fill: none;
    stroke: #7566ff;
    stroke-width: 2;
    transform-box: fill-box;
    transform-origin: center;
    animation: joint-pulse 2.8s ease-out infinite;
  }
  .pulse-b { animation-delay: -1.3s; }

  .neural-transition {
    position: absolute;
    z-index: -2;
    right: 0;
    bottom: 0;
    left: 0;
    height: 390px;
    background: linear-gradient(to bottom, transparent, rgba(233, 237, 250, 0.72) 48%, rgba(238, 241, 248, 0.96));
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

  @keyframes ekg-pulse {
    0% { opacity: 0; stroke-dashoffset: 1500; }
    12% { opacity: 1; }
    72% { opacity: 1; stroke-dashoffset: 0; }
    100% { opacity: 0; stroke-dashoffset: -1500; }
  }
  @keyframes joint-pulse { 0% { opacity: 0.8; transform: scale(0.65); } 78%, 100% { opacity: 0; transform: scale(1.65); } }
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
