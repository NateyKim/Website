<script lang="ts">
  import { onMount } from 'svelte';
  import { autoplayWhenVisible } from '$lib/autoplayWhenVisible';

  type CarouselType = 'mookie' | 'clementine' | 'photosilike';
  type BaseImage = { src: string; alt: string; isVideo: boolean; caption?: string };
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

  const photosilikeBaseImages: BaseImage[] = [
    { src: '/photosilike/bench.jpg', alt: 'Bench overlooking the ocean', isVideo: false, caption: 'Some Beach, Jamaica' },
    { src: '/photosilike/bluemountain.jpg', alt: 'Lush green mountains', isVideo: false, caption: 'Blue Mountains, Jamaica' },
    { src: '/photosilike/Jamaica.jpg', alt: 'Orange sunset over the ocean', isVideo: false, caption: 'Montego Bay, Jamaica' },
    { src: '/photosilike/strawsburg.jpg', alt: 'Leaves overhanging the water', isVideo: false, caption: 'Strasbourg, France' },
    { src: '/photosilike/coloseeum.jpg', alt: 'The Colosseum', isVideo: false, caption: 'Rome, Italy' },
    { src: '/photosilike/IMG_20230730_211429627_HDR.jpg', alt: 'Florence skyline beneath orange clouds', isVideo: false, caption: 'Florence, Italy' },
    { src: '/photosilike/IMG_20230725_172908282.jpg', alt: 'Clock in the Musée d’Orsay', isVideo: false, caption: 'Paris, France' },
    { src: '/photosilike/kyoto.jpg', alt: 'Kinkaku-ji beside its reflecting pond', isVideo: false, caption: 'Kyoto, Japan' },
    { src: '/photosilike/philly.jpg', alt: 'Garden surrounded by trees', isVideo: false, caption: 'Philadelphia, USA' },
    { src: '/photosilike/kaiyukan.jpg', alt: 'Illuminated whale shark at Osaka Aquarium Kaiyukan', isVideo: false, caption: 'Osaka, Japan' },
    { src: '/photosilike/poconos.jpg', alt: 'Waterfall surrounded by autumn trees', isVideo: false, caption: 'Poconos, USA' },
    { src: '/photosilike/tokyo-flame.jpg', alt: 'Asahi Flame framed by trees and flowers', isVideo: false, caption: 'Tokyo, Japan' },
    { src: '/photosilike/tokyo-skyline.jpg', alt: 'Tokyo skyline at night', isVideo: false, caption: 'Tokyo, Japan' },
    { src: '/photosilike/wooded-lake.jpg', alt: 'Wooded lake in autumn', isVideo: false, caption: 'Poconos, USA' },
    { src: '/photosilike/gateway-arch.jpg', alt: 'Gateway Arch beneath a blue sky', isVideo: false, caption: 'St. Louis, USA' }
  ];

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

<header class="personal-header">
  <p class="eyebrow">A little less formal</p>
  <h1>Beyond the Work</h1>
  <p>The pets, music, games, food, and places that fill the space outside engineering.</p>
</header>

<section class="personal-category pets-category">
<h2>Pets</h2>

<h3>Mookie <span>(age: {mookieAge})</span></h3>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'mookie')}
  on:touchstart={handleTouchStart}
  on:touchmove|preventDefault={(event) => handleTouchMove(event, 'mookie')}
>
  <div class="track" bind:this={mookieCarousel}>
    {#each mookieImages as image (image.id)}
      <div class="card">
        <img src={image.src} alt={image.alt} loading="lazy" />
      </div>
    {/each}
  </div>
</div>

<h3>Clementine <span>(age: {clementineAge})</span></h3>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'clementine')}
  on:touchstart={handleTouchStart}
  on:touchmove|preventDefault={(event) => handleTouchMove(event, 'clementine')}
>
  <div class="track" bind:this={clementineCarousel}>
    {#each clementineImages as image (image.id)}
      <div class="card">
        {#if image.isVideo}
          <video use:autoplayWhenVisible controls muted loop playsinline preload="metadata" aria-label={image.alt}>
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
</section>

<section class="personal-category personal-media-section">
  <div class="media-heading">
    <div>
      <p class="interest-number">01</p>
      <h2>Music</h2>
    </div>
    <p>Piano and guitar performances, collected as a compilation of videos.</p>
  </div>
  <div class="future-carousel" aria-label="Music video carousel">
    <div class="future-card">Music videos coming soon</div>
  </div>
</section>

<section class="personal-category personal-media-section">
  <div class="media-heading">
    <div>
      <p class="interest-number">02</p>
      <h2>Games</h2>
    </div>
    <p>A future mix of photos and videos from games and the worlds around them.</p>
  </div>
  <div class="future-carousel" aria-label="Games media carousel">
    <div class="future-card">Game photos and videos coming soon</div>
  </div>
</section>

<section class="personal-category personal-media-section">
  <div class="media-heading">
    <div>
      <p class="interest-number">03</p>
      <h2>Food</h2>
    </div>
    <p>Favorite meals, memorable finds, and things worth ordering twice.</p>
  </div>
  <div class="future-carousel" aria-label="Food photo carousel">
    <div class="future-card">Food photos coming soon</div>
  </div>
</section>

<section class="personal-category">
<h2>Camera Roll Top Picks</h2>

<div
  class="carousel"
  on:wheel={(event) => handleWheel(event, 'photosilike')}
  on:touchstart={handleTouchStart}
  on:touchmove|preventDefault={(event) => handleTouchMove(event, 'photosilike')}
>
  <div class="track" bind:this={photosilikeCarousel}>
    {#each photosilikeImages as image (image.id)}
      <div class="card camera-card">
        <img src={image.src} alt={image.alt} class:upright-arch={image.src.endsWith('/gateway-arch.jpg')} />
        {#if image.caption}
          <div class="photo-caption">{image.caption}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>
</section>

<style>
  .personal-header,
  .personal-category {
    max-width: 1200px;
    margin-right: auto;
    margin-left: auto;
  }

  .personal-header {
    padding: 3rem 0 1rem;
  }

  .personal-header h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2.5rem, 7vw, 4.5rem);
  }

  .personal-header p:last-child {
    max-width: 660px;
    line-height: 1.6;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    color: #666;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .personal-category {
    padding: 0;
  }

  h2 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
  }

  h3 {
    margin: 2rem 0 1rem;
    font-size: 1.45rem;
  }

  h3 span {
    color: #666;
    font-size: 1rem;
    font-weight: 400;
  }

  .personal-media-section {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }

  .media-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .media-heading h2 {
    margin-top: 0.4rem;
    margin-bottom: 0;
  }

  .media-heading > p {
    max-width: 520px;
    margin: 0;
    line-height: 1.6;
  }

  .interest-number {
    margin: 0;
    color: #777;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .future-carousel {
    display: flex;
    min-height: 240px;
    overflow-x: auto;
    border: 1px solid #c9c9c9;
    border-radius: 0.75rem;
    background: rgba(0, 0, 0, 0.025);
    scroll-snap-type: x mandatory;
  }

  .future-card {
    display: grid;
    min-width: 100%;
    place-items: center;
    padding: 2rem;
    color: #777;
    font-weight: 600;
    text-align: center;
    scroll-snap-align: start;
  }

  .carousel {
    overflow: hidden;
    height: 400px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    touch-action: pan-y;
    -webkit-user-select: none;
    user-select: none;
  }

  .track {
    display: flex;
    gap: 32px;
    height: 100%;
    transition: transform 0.1s ease-out;
    will-change: transform;
  }

  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    height: 100%;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .card img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .card video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
    background: #111;
  }

  .photo-caption {
    display: flex;
    height: 3rem;
    padding: 0 0.75rem;
    align-items: center;
    justify-content: center;
    background: var(--background, white);
    color: inherit;
    font-size: 0.95rem;
    text-align: center;
  }

  .camera-card img {
    max-height: calc(100% - 3rem);
    border-radius: 8px 8px 0 0;
  }

  .camera-card {
    flex-direction: column;
  }

  .camera-card .photo-caption {
    width: 100%;
    box-sizing: border-box;
  }

  .camera-card img.upright-arch {
    transform: rotate(180deg);
  }

  @media (max-width: 700px) {
    .personal-header,
    .personal-category {
      width: auto;
      margin-right: 1rem;
      margin-left: 1rem;
    }

    .carousel {
      height: min(400px, 105vw);
    }

    .media-heading {
      align-items: start;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
