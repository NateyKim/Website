<script lang="ts">
  import { onMount } from 'svelte';

  type CarouselType = 'mookie' | 'clementine' | 'photosilike';
  type BaseImage = { src: string; alt: string; isVideo: boolean };
  type CarouselImage = BaseImage & { id: string };
  type Age = { years: number; months: number };

  const mookieModules = import.meta.glob('/static/mookie/*.{jpg,jpeg,png,gif}', {
    eager: true
  });

  const mookieExistingImages = Object.entries(mookieModules).map(([path]) => {
    const filename = path.split('/').pop() ?? 'Mookie photo';
    const src = path.replace('/static', '');
    const alt = filename
      .replace(/\.(jpg|jpeg|png|gif|mp4)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase());

    return { src, alt, isVideo: src.endsWith('.mp4') };
  });

  const mookieBaseImages: BaseImage[] = [
    ...mookieExistingImages,
    { src: '/pets/mookie-car.jpg', alt: 'Mookie in the car', isVideo: false },
    { src: '/pets/mookie-yawn.gif', alt: 'Mookie yawning', isVideo: false },
    { src: '/pets/mookie-reindeer.jpg', alt: 'Mookie dressed as a reindeer', isVideo: false },
    { src: '/pets/mookie-costume.jpg', alt: 'Mookie in costume', isVideo: false }
  ];

  const clementineModules = import.meta.glob(
    '/static/clementine/*.{jpg,jpeg,png,gif,mp4}',
    { eager: true }
  );

  const clementineExistingImages = Object.entries(clementineModules).map(
    ([path]) => {
      const filename = path.split('/').pop() ?? 'Clementine photo';
      const src = path.replace('/static', '');
      const alt = filename
        .replace(/\.(jpg|jpeg|png|gif|mp4)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());

      return { src, alt, isVideo: src.endsWith('.mp4') };
    }
  );

  const clementineBaseImages: BaseImage[] = [
    ...clementineExistingImages,
    { src: '/pets/clementine-portrait.jpg', alt: 'Clementine portrait', isVideo: false },
    { src: '/pets/clementine-kitten.jpg', alt: 'Clementine as a kitten', isVideo: false },
    { src: '/pets/clementine-halloween.jpg', alt: 'Clementine in a Halloween costume', isVideo: false },
    { src: '/pets/clementine-video-h264.mp4', alt: 'Clementine video', isVideo: true }
  ];

  const photosilikeModules = import.meta.glob(
    '/static/photosilike/*.jpg',
    { eager: true }
  );

  const photosilikeBaseImages = Object.entries(photosilikeModules).map(
    ([path]) => {
      const filename = path.split('/').pop() ?? 'Camera roll photo';
      const src = path.replace('/static', '');
      const alt = filename
        .replace(/\.jpg$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());

      return { src, alt, isVideo: false };
    }
  );

  const mookieBirthday = new Date(2019, 9, 9);

  // Only the birth month was provided, so Clementine's age changes May 1.
  const clementineBirthday = new Date(2025, 4, 1);

  function calculateAge(birthday: Date, today: Date = new Date()): Age {
    let years = today.getFullYear() - birthday.getFullYear();
    let months = today.getMonth() - birthday.getMonth();

    if (today.getDate() < birthday.getDate()) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months };
  }

  function formatAge(age: Age) {
    const yearLabel = age.years === 1 ? 'year' : 'years';
    const monthLabel = age.months === 1 ? 'month' : 'months';

    return `${age.years} ${yearLabel}, ${age.months} ${monthLabel}`;
  }

  let mookieAge = formatAge(calculateAge(mookieBirthday));
  let clementineAge = formatAge(calculateAge(clementineBirthday));
  let ageUpdateInterval: ReturnType<typeof setInterval>;

  let mookieCarousel: HTMLDivElement;
  let clementineCarousel: HTMLDivElement;
  let photosilikeCarousel: HTMLDivElement;

  let mookieScroll = 0;
  let clementineScroll = 0;
  let photosilikeScroll = 0;

  let mookieImages: CarouselImage[] = [];
  let clementineImages: CarouselImage[] = [];
  let photosilikeImages: CarouselImage[] = [];

  const cardWidth = 300 + 32;
  const COPIES = 21;

  let touchStartX = 0;

  function setupCarousel(baseImages: BaseImage[]) {
    const images: CarouselImage[] = [];

    for (let i = 0; i < COPIES; i++) {
      images.push(
        ...baseImages.map((image, index) => ({
          ...image,
          id: `${i}-${index}`
        }))
      );
    }

    return {
      images,
      start: Math.floor(COPIES / 2) * baseImages.length * cardWidth
    };
  }

  function update(type: CarouselType, delta: number) {
    let scroll: number;
    let carousel: HTMLDivElement;
    let baseLength: number;

    if (type === 'mookie') {
      scroll = mookieScroll;
      carousel = mookieCarousel;
      baseLength = mookieBaseImages.length;
    } else if (type === 'clementine') {
      scroll = clementineScroll;
      carousel = clementineCarousel;
      baseLength = clementineBaseImages.length;
    } else if (type === 'photosilike') {
      scroll = photosilikeScroll;
      carousel = photosilikeCarousel;
      baseLength = photosilikeBaseImages.length;
    } else {
      return;
    }

    let newScroll = scroll + delta;
    const totalWidth = COPIES * baseLength * cardWidth;
    const resetZone = cardWidth * baseLength;

    if (newScroll < resetZone) {
      newScroll += totalWidth / 2;
    } else if (newScroll > totalWidth - resetZone) {
      newScroll -= totalWidth / 2;
    }

    carousel.style.transform = `translateX(-${newScroll}px)`;

    if (type === 'mookie') {
      mookieScroll = newScroll;
    } else if (type === 'clementine') {
      clementineScroll = newScroll;
    } else if (type === 'photosilike') {
      photosilikeScroll = newScroll;
    }
  }

  function handleWheel(event: WheelEvent, type: CarouselType) {
    event.preventDefault();
    update(type, event.deltaY * 2);
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX;
  }

  function handleTouchMove(event: TouchEvent, type: CarouselType) {
    const touchX = event.touches[0].clientX;
    const delta = (touchStartX - touchX) * 2;

    update(type, delta);
    touchStartX = touchX;
  }

  onMount(() => {
    const updateAges = () => {
      const today = new Date();

      mookieAge = formatAge(calculateAge(mookieBirthday, today));
      clementineAge = formatAge(calculateAge(clementineBirthday, today));
    };

    updateAges();
    ageUpdateInterval = setInterval(updateAges, 60 * 60 * 1000);

    const mookieSetup = setupCarousel(mookieBaseImages);
    mookieImages = mookieSetup.images;
    mookieScroll = mookieSetup.start;
    mookieCarousel.style.transform = `translateX(-${mookieScroll}px)`;

    const clementineSetup = setupCarousel(clementineBaseImages);
    clementineImages = clementineSetup.images;
    clementineScroll = clementineSetup.start;
    clementineCarousel.style.transform =
      `translateX(-${clementineScroll}px)`;

    const photosSetup = setupCarousel(photosilikeBaseImages);
    photosilikeImages = photosSetup.images;
    photosilikeScroll = photosSetup.start;
    photosilikeCarousel.style.transform =
      `translateX(-${photosilikeScroll}px)`;

    return () => clearInterval(ageUpdateInterval);
  });
</script>

<h1>Mookie (age: {mookieAge})</h1>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'mookie')}
  on:touchstart={handleTouchStart}
  on:touchmove={(event) => handleTouchMove(event, 'mookie')}
>
  <div class="track" bind:this={mookieCarousel}>
    {#each mookieImages as image (image.id)}
      <div class="card">
        <img src={image.src} alt={image.alt} loading="lazy" />
      </div>
    {/each}
  </div>
</div>

<h1>Clementine (age: {clementineAge})</h1>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'clementine')}
  on:touchstart={handleTouchStart}
  on:touchmove={(event) => handleTouchMove(event, 'clementine')}
>
  <div class="track" bind:this={clementineCarousel}>
    {#each clementineImages as image (image.id)}
      <div class="card">
        {#if image.isVideo}
          <video controls playsinline preload="none" aria-label={image.alt}>
            <source src={image.src} type="video/mp4" />
            <track kind="captions" src="/pets/clementine-video.vtt" srclang="en" label="English" default />
          </video>
        {:else}
          <img src={image.src} alt={image.alt} loading="lazy" />
        {/if}
      </div>
    {/each}
  </div>
</div>

<h1>Camera Roll Top Picks</h1>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'photosilike')}
  on:touchstart={handleTouchStart}
  on:touchmove={(event) => handleTouchMove(event, 'photosilike')}
>
  <div class="track" bind:this={photosilikeCarousel}>
    {#each photosilikeImages as image (image.id)}
      <div class="card">
        <img src={image.src} alt={image.alt} />
      </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
  }

  .carousel {
    overflow: hidden;
    height: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    touch-action: pan-y;
  }

  .track {
    display: flex;
    gap: 32px;
    height: 100%;
    transition: transform 0.1s ease-out;
    will-change: transform;
  }

  .card {
    min-width: 300px;
    height: 100%;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .card img, .card video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
</style>
