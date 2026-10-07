<script lang="ts">
  const bio = [
    'I am a research engineer at Penn’s GRASP Laboratory working at the intersection of assistive robotics, human movement, and human–robot interaction. I earned an M.S.E. in Robotics and a B.S.E. in Bioengineering from the University of Pennsylvania.',
    'My research spans upper-limb exoskeletons, EMG-informed musculoskeletal digital twins, human-in-the-loop control, machine learning for injury assessment, and socially assistive robots. I build systems that translate neuromuscular intent into adaptive, intuitive, and clinically meaningful technologies.',
    'Alongside my work at Penn, I am a research resident at Maingen, where I study machine-learning methods for robotic end-effector design, and a founding mechanical engineer at Tadashi Robotics, where I am helping translate the Ember social-robotics platform into a rehabilitative product.'
  ];

</script>

<section class="intro-wrapper">
  <div class="title-row">
    <h1 class="header-title">Natey Kim</h1>
    <a
      class="linkedin-link"
      href="https://www.linkedin.com/in/nateykim"
      target="_blank"
      rel="noreferrer"
      aria-label="Visit Natey Kim’s LinkedIn profile"
      title="LinkedIn"
    >
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
      </svg>
    </a>
  </div>
  <p class="job-title">Human–Robot Interaction Research Engineer @ UPenn GRASP Lab</p>

  <div class="intro-section">
    <div class="intro-visual" aria-hidden="true">
      <svg class="ai-system" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="signal-gradient" x1="0" x2="1">
            <stop offset="0" stop-color="#35b7ff" />
            <stop offset="0.55" stop-color="#7668ff" />
            <stop offset="1" stop-color="#dc5cff" />
          </linearGradient>
          <radialGradient id="core-gradient">
            <stop offset="0" stop-color="#ffffff" />
            <stop offset="0.28" stop-color="#9fdcff" />
            <stop offset="0.68" stop-color="#7668ff" />
            <stop offset="1" stop-color="#3d2f87" />
          </radialGradient>
          <filter id="soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g class="ambient-grid">
          <path d="M0 70 H1200 M0 180 H1200 M0 290 H1200" />
          <path d="M120 0 V360 M360 0 V360 M600 0 V360 M840 0 V360 M1080 0 V360" />
        </g>

        <g class="input-system">
          <text x="45" y="76">BIOSIGNAL INPUT</text>
          <path class="input-ring" d="M64 180 A76 76 0 1 1 216 180 A76 76 0 1 1 64 180" />
          <path class="signal-path" d="M42 181 H76 L89 181 L99 133 L115 235 L132 159 L149 200 L163 181 H228" />
          <circle class="sensor-dot sensor-one" cx="140" cy="104" r="5" />
          <circle class="sensor-dot sensor-two" cx="202" cy="146" r="4" />
          <circle class="sensor-dot sensor-three" cx="105" cy="251" r="4" />
        </g>

        <g class="network-lines">
          <path d="M228 181 C276 181 282 93 330 93 M228 181 C276 181 282 153 330 153 M228 181 C276 181 282 213 330 213 M228 181 C276 181 282 273 330 273" />
          <path d="M330 93 C380 93 390 127 438 127 M330 93 C380 93 390 181 438 181 M330 153 C380 153 390 127 438 127 M330 153 C380 153 390 235 438 235 M330 213 C380 213 390 127 438 127 M330 213 C380 213 390 235 438 235 M330 273 C380 273 390 181 438 181 M330 273 C380 273 390 235 438 235" />
          <path d="M438 127 C492 127 510 181 556 181 M438 181 H556 M438 235 C492 235 510 181 556 181" />
        </g>

        <g class="neural-nodes">
          <circle cx="330" cy="93" r="9" /><circle cx="330" cy="153" r="9" />
          <circle cx="330" cy="213" r="9" /><circle cx="330" cy="273" r="9" />
          <circle cx="438" cy="127" r="10" /><circle cx="438" cy="181" r="10" /><circle cx="438" cy="235" r="10" />
        </g>

        <g class="latent-core" filter="url(#soft-glow)">
          <circle class="core-halo halo-one" cx="600" cy="181" r="82" />
          <circle class="core-halo halo-two" cx="600" cy="181" r="61" />
          <circle class="core" cx="600" cy="181" r="38" />
          <path class="core-mark" d="M583 181 L595 193 L619 166" />
        </g>
        <text class="core-label" x="600" y="298">ADAPTIVE CONTROL</text>

        <g class="output-streams">
          <path id="stream-a" d="M644 160 C728 80 804 82 882 137" />
          <path id="stream-b" d="M644 181 C735 181 800 181 882 181" />
          <path id="stream-c" d="M644 202 C728 282 804 280 882 225" />
          <circle class="data-particle particle-one" r="5"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#stream-a" /></animateMotion></circle>
          <circle class="data-particle particle-two" r="5"><animateMotion dur="2.7s" begin="-1s" repeatCount="indefinite"><mpath href="#stream-b" /></animateMotion></circle>
          <circle class="data-particle particle-three" r="5"><animateMotion dur="3.5s" begin="-2s" repeatCount="indefinite"><mpath href="#stream-c" /></animateMotion></circle>
        </g>

        <g class="robot-system">
          <text x="925" y="76">ROBOTIC OUTPUT</text>
          <path class="robot-base" d="M950 285 H1118 M978 285 V258 H1088 V285" />
          <g class="robot-upper">
            <path d="M1034 258 L972 198" />
            <circle cx="1034" cy="258" r="15" /><circle cx="972" cy="198" r="13" />
          </g>
          <g class="robot-forearm">
            <path d="M972 198 L1042 133" />
            <circle cx="1042" cy="133" r="11" />
            <path class="gripper" d="M1042 133 L1091 109 M1042 133 L1094 148 M1091 109 L1115 99 M1094 148 L1117 160" />
          </g>
          <circle class="joint-wave wave-one" cx="972" cy="198" r="22" />
          <circle class="joint-wave wave-two" cx="1034" cy="258" r="24" />
        </g>
      </svg>
    </div>

    <div class="intro-right">
      {#each bio as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
  </div>
</section>

<style>
  .intro-wrapper {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0;
  }

  .header-title {
    grid-column: 2;
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
  }

  .title-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.35rem;
  }

  .linkedin-link {
    grid-column: 3;
    justify-self: end;
    display: inline-flex;
    width: 2.25rem;
    height: 2.25rem;
    color: #0a66c2;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .linkedin-link:hover,
  .linkedin-link:focus-visible {
    opacity: 0.8;
    transform: translateY(-2px);
  }

  .linkedin-link svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .job-title {
    margin: 0 0 2rem;
    text-align: center;
    color: #555;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .intro-section {
    display: grid;
    gap: 2.5rem;
  }

  .intro-visual {
    width: 100%;
    overflow: hidden;
    border: 1px solid #dfe4eb;
    border-radius: 1.25rem;
    background:
      radial-gradient(circle at 52% 48%, rgba(118, 104, 255, 0.13), transparent 26%),
      linear-gradient(135deg, #f8fbff 0%, #f2f2ff 50%, #fbf7ff 100%);
    box-shadow: 0 18px 55px rgba(24, 31, 50, 0.1);
  }

  .ai-system {
    display: block;
    width: 100%;
    height: auto;
  }

  .ambient-grid path {
    fill: none;
    stroke: #536174;
    stroke-width: 1;
    opacity: 0.08;
  }

  .input-system text,
  .robot-system text,
  .core-label {
    fill: #536174;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.16em;
  }

  .core-label {
    text-anchor: middle;
  }

  .input-ring {
    fill: none;
    stroke: #7668ff;
    stroke-width: 1.5;
    stroke-dasharray: 5 9;
    transform-origin: 140px 180px;
    animation: ring-spin 18s linear infinite;
  }

  .signal-path {
    fill: none;
    stroke: url(#signal-gradient);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 260;
    animation: signal-flow 3s ease-in-out infinite;
  }

  .sensor-dot,
  .neural-nodes circle,
  .data-particle {
    fill: #7668ff;
  }

  .sensor-dot {
    animation: sensor-pulse 2.2s ease-in-out infinite;
  }

  .sensor-two { animation-delay: -0.7s; }
  .sensor-three { animation-delay: -1.4s; }

  .network-lines path,
  .output-streams path {
    fill: none;
    stroke: #8a93a3;
    stroke-width: 1.4;
    opacity: 0.42;
  }

  .neural-nodes circle {
    stroke: white;
    stroke-width: 3;
    animation: neural-pulse 2.8s ease-in-out infinite alternate;
  }

  .neural-nodes circle:nth-child(2n) { animation-delay: -1.3s; }
  .neural-nodes circle:nth-child(3n) { animation-delay: -2s; }

  .core-halo {
    fill: none;
    stroke: #7668ff;
    stroke-width: 1.5;
    stroke-dasharray: 8 12;
    transform-origin: 600px 181px;
    animation: ring-spin 12s linear infinite;
  }

  .halo-two {
    animation-direction: reverse;
    animation-duration: 8s;
  }

  .core {
    fill: url(#core-gradient);
    animation: core-breathe 2.8s ease-in-out infinite;
    transform-origin: 600px 181px;
  }

  .core-mark {
    fill: none;
    stroke: white;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .data-particle {
    filter: url(#soft-glow);
  }

  .robot-base,
  .robot-upper path,
  .robot-forearm path {
    fill: none;
    stroke: #252a2f;
    stroke-width: 10;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .robot-upper circle,
  .robot-forearm circle {
    fill: white;
    stroke: #252a2f;
    stroke-width: 5;
  }

  .robot-upper {
    transform-origin: 1034px 258px;
    animation: upper-arm-motion 5s ease-in-out infinite;
  }

  .robot-forearm {
    transform-origin: 972px 198px;
    animation: forearm-motion 5s ease-in-out infinite;
  }

  .robot-forearm .gripper {
    stroke-width: 5;
  }

  .joint-wave {
    fill: none;
    stroke: #7668ff;
    stroke-width: 2;
    transform-box: fill-box;
    transform-origin: center;
    animation: joint-pulse 2.4s ease-out infinite;
  }

  .wave-two { animation-delay: -1.1s; }

  @keyframes signal-flow {
    0% { stroke-dashoffset: 260; opacity: 0.25; }
    45%, 75% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: -260; opacity: 0.25; }
  }

  @keyframes sensor-pulse {
    50% { opacity: 0.25; transform: scale(1.8); transform-box: fill-box; transform-origin: center; }
  }

  @keyframes neural-pulse {
    to { fill: #35b7ff; transform: scale(1.3); transform-box: fill-box; transform-origin: center; }
  }

  @keyframes core-breathe {
    50% { transform: scale(1.12); opacity: 0.9; }
  }

  @keyframes upper-arm-motion {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(7deg); }
  }

  @keyframes forearm-motion {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(-12deg); }
  }

  @keyframes joint-pulse {
    0% { opacity: 0.75; transform: scale(0.65); }
    80%, 100% { opacity: 0; transform: scale(1.65); }
  }

  @keyframes ring-spin {
    to { transform: rotate(360deg); }
  }

  .intro-right {
    width: min(920px, 100%);
    margin: 0 auto;
    padding: 0 1rem;
  }

  .intro-right p {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .intro-wrapper {
      margin-right: 1rem;
      margin-left: 1rem;
    }

    .intro-section {
      gap: 1.5rem;
    }

    .intro-visual,
    .intro-right {
      width: 100%;
      text-align: center;
    }

    .intro-visual {
      border-radius: 0.85rem;
    }

    .ai-system {
      width: 165%;
      max-width: none;
      margin-left: -32.5%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-system * {
      animation: none !important;
    }
  }
</style>
