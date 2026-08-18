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
  <h1 class="header-title">Natey Kim</h1>
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
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.35rem;
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
