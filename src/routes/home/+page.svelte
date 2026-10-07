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
      <svg class="signal-motion" viewBox="0 0 420 320">
        <circle class="orbit orbit-one" cx="255" cy="168" r="112" />
        <circle class="orbit orbit-two" cx="255" cy="168" r="78" />

        <path class="signal-path" d="M18 164 H58 L69 164 L78 130 L91 202 L104 151 L115 176 L128 164 H166" />
        <circle class="signal-node" cx="166" cy="164" r="6" />

        <g class="arm-base">
          <path d="M248 252 H316" />
          <path d="M260 252 V225 H304 V252" />
          <circle cx="282" cy="222" r="13" />
        </g>
        <g class="upper-arm">
          <path d="M282 222 L238 166" />
          <circle cx="238" cy="166" r="12" />
        </g>
        <g class="forearm">
          <path d="M238 166 L289 112" />
          <circle cx="289" cy="112" r="10" />
          <path class="gripper" d="M289 112 L326 91 M289 112 L329 121 M326 91 L342 85 M329 121 L344 127" />
        </g>

        <circle class="pulse pulse-one" cx="238" cy="166" r="19" />
        <circle class="pulse pulse-two" cx="282" cy="222" r="20" />
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
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .intro-visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 320px;
  }

  .signal-motion {
    width: min(100%, 440px);
    overflow: visible;
  }

  .orbit {
    fill: none;
    stroke: #d9dde1;
    stroke-width: 1;
    stroke-dasharray: 5 10;
    transform-origin: 255px 168px;
    animation: orbit-spin 22s linear infinite;
  }

  .orbit-two {
    animation-direction: reverse;
    animation-duration: 16s;
  }

  .signal-path,
  .arm-base path,
  .upper-arm path,
  .forearm path {
    fill: none;
    stroke: #252a2f;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .signal-path {
    stroke: #0a66c2;
    stroke-width: 4;
    stroke-dasharray: 230;
    animation: signal-flow 3.2s ease-in-out infinite;
  }

  .signal-node {
    fill: #0a66c2;
    animation: node-pulse 1.6s ease-in-out infinite;
  }

  .arm-base path,
  .upper-arm path,
  .forearm path {
    stroke-width: 9;
  }

  .arm-base circle,
  .upper-arm circle,
  .forearm circle {
    fill: white;
    stroke: #252a2f;
    stroke-width: 5;
  }

  .upper-arm {
    transform-origin: 282px 222px;
    animation: upper-arm-motion 5s ease-in-out infinite;
  }

  .forearm {
    transform-origin: 238px 166px;
    animation: forearm-motion 5s ease-in-out infinite;
  }

  .forearm .gripper {
    stroke-width: 5;
  }

  .pulse {
    fill: none;
    stroke: #0a66c2;
    stroke-width: 2;
    transform-box: fill-box;
    transform-origin: center;
    animation: joint-pulse 2.5s ease-out infinite;
  }

  .pulse-two {
    animation-delay: 0.7s;
  }

  @keyframes signal-flow {
    0% { stroke-dashoffset: 230; opacity: 0.25; }
    45%, 75% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: -230; opacity: 0.25; }
  }

  @keyframes node-pulse {
    50% { transform: scale(1.5); transform-origin: 166px 164px; }
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

  @keyframes orbit-spin {
    to { transform: rotate(360deg); }
  }

  .intro-right {
    flex: 1;
    padding: 1rem;
    max-width: 600px;
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
      flex-direction: column;
    }

    .intro-visual,
    .intro-right {
      width: 100%;
      text-align: center;
    }

    .intro-visual {
      min-width: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .signal-motion * {
      animation: none !important;
    }
  }
</style>
