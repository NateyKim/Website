<script lang="ts">
  import { onMount } from 'svelte';

  const bio = [
    'I am a researcher in assistive robotics and human movement, with interests in upper-limb exoskeletons, EMG-informed musculoskeletal modeling, rehabilitation robotics, and intuitive human–robot control.',
    'My experience includes EMG-based motion prediction, MuJoCo musculoskeletal simulation, machine learning for injury assessment, EMG-controlled bionic arms, and socially assistive robots. I am particularly interested in translating neuromuscular intent into adaptive, intuitive, and clinically meaningful assistive technologies.',
    'I am currently pursuing PhD opportunities in wearable and assistive robotics, biomechanics, neuromuscular modeling, and human-centered robotic systems.'
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
    margin-bottom: 2rem;
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
