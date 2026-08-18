<script lang="ts">
  import { onMount } from 'svelte';

  const bio = [
    'I am a research engineer at Penn’s GRASP Laboratory working at the intersection of assistive robotics, human movement, and human–robot interaction. I earned an M.S.E. in Robotics and a B.S.E. in Bioengineering from the University of Pennsylvania, both with a 4.0 GPA.',
    'My research spans upper-limb exoskeletons, EMG-informed musculoskeletal digital twins, human-in-the-loop control, machine learning for injury assessment, and socially assistive robots. I build systems that translate neuromuscular intent into adaptive, intuitive, and clinically meaningful technologies.',
    'Alongside my work at Penn, I am a research resident at Maingen, where I study machine-learning methods for robotic end-effector design, and a founding mechanical engineer at Tadashi Robotics, where I am helping translate the Ember social-robotics platform into a rehabilitative product.'
  ];

  const youModules = import.meta.glob('/static/koroks/*.png', {
    eager: true
  });

  const youImages = Object.entries(youModules).map(([path]) => {
    const filename = path.split('/').pop();
    const src = path.replace('/static', '');
    const alt = `Photo of Natey (${filename})`;

    return { src, alt };
  });

  let currentIndex = 0;
  let interval: ReturnType<typeof setInterval>;

  function cycleImages() {
    if (youImages.length > 0) {
      currentIndex = (currentIndex + 1) % youImages.length;
    }
  }

  onMount(() => {
    interval = setInterval(cycleImages, 2000);

    return () => clearInterval(interval);
  });
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
  <p class="job-title">Human–Robot Interaction Research Engineer @ Penn GRASP</p>

  <div class="intro-section">
    <div class="intro-left">
      {#if youImages.length > 0}
        <img
          src={youImages[currentIndex].src}
          alt={youImages[currentIndex].alt}
          class="clickable-image"
        />
      {:else}
        <p>No images found.</p>
      {/if}
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
    padding: 2rem;
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

  .intro-left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .clickable-image {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    .intro-section {
      flex-direction: column;
    }

    .intro-left,
    .intro-right {
      width: 100%;
      text-align: center;
    }
  }
</style>
