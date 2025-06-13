<script>
  import { onMount } from 'svelte';

  const mookieModules = import.meta.glob('/static/mookie/*.jpg', { eager: true });
  const mookieBaseImages = Object.entries(mookieModules).map(([path]) => {
    const filename = path.split('/').pop();
    const src = path.replace('/static', '');
    const alt = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { src, alt };
  });

  const clementineModules = import.meta.glob('/static/clementine/*.jpg', { eager: true });
  const clementineBaseImages = Object.entries(clementineModules).map(([path]) => {
    const filename = path.split('/').pop();
    const src = path.replace('/static', '');
    const alt = filename
      .replace(/\.jpg$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { src, alt };
  });

  console.log('Mookie modules:', mookieModules);
  console.log('Clementine modules:', clementineModules);

  let mookieCarousel, clementineCarousel;
  let mookieScrollPosition = 0, clementineScrollPosition = 0;
  let mookieImages = [];
  let clementineImages = [];
  
  const cardWidth = 300 + 32; // card width + gap
  const bufferZone = cardWidth * 3; // Add more images when within 3 cards of edge
  
  // Create initial image array with multiple copies for smooth infinite scroll
  function initializeImages(baseImages) {
    const copies = 5; // Start with 5 copies of each direction
    const images = [];
    
    // Add multiple copies to ensure smooth scrolling in both directions
    for (let i = 0; i < copies; i++) {
      images.push(...baseImages.map((img, idx) => ({ 
        ...img, 
        id: `${i}-${idx}` 
      })));
    }
    
    return {
      images,
      startPosition: Math.floor(copies / 2) * baseImages.length * cardWidth
    };
  }

  function addImagesAtEnd(baseImages, currentImages) {
    const newImages = baseImages.map((img, idx) => ({ 
      ...img, 
      id: `end-${Date.now()}-${idx}` 
    }));
    return [...currentImages, ...newImages];
  }

  function addImagesAtStart(baseImages, currentImages) {
    const newImages = baseImages.map((img, idx) => ({ 
      ...img, 
      id: `start-${Date.now()}-${idx}` 
    }));
    return [...newImages, ...currentImages];
  }

  function handleMookieWheel(event) {
    event.preventDefault();
    
    const scrollSpeed = 2;
    mookieScrollPosition += event.deltaY * scrollSpeed;
    
    // Ensure we don't go negative
    if (mookieScrollPosition < 0) {
      mookieScrollPosition = 0;
    }
    
    const totalWidth = mookieImages.length * cardWidth;
    let adjustPosition = 0;
    
    // If scrolling right and approaching the end
    if (mookieScrollPosition > totalWidth - bufferZone) {
      mookieImages = addImagesAtEnd(mookieBaseImages, mookieImages);
    }
    
    // If scrolling left and approaching the start
    if (mookieScrollPosition < bufferZone) {
      mookieImages = addImagesAtStart(mookieBaseImages, mookieImages);
      adjustPosition = mookieBaseImages.length * cardWidth;
      mookieScrollPosition += adjustPosition;
    }
    
    // Apply the transform
    if (mookieCarousel) {
      mookieCarousel.style.transform = `translateX(-${mookieScrollPosition}px)`;
    }
  }

  function handleClementineWheel(event) {
    event.preventDefault();
    
    const scrollSpeed = 2;
    clementineScrollPosition += event.deltaY * scrollSpeed;
    
    // Ensure we don't go negative
    if (clementineScrollPosition < 0) {
      clementineScrollPosition = 0;
    }
    
    const totalWidth = clementineImages.length * cardWidth;
    let adjustPosition = 0;
    
    // If scrolling right and approaching the end
    if (clementineScrollPosition > totalWidth - bufferZone) {
      clementineImages = addImagesAtEnd(clementineBaseImages, clementineImages);
    }
    
    // If scrolling left and approaching the start
    if (clementineScrollPosition < bufferZone) {
      clementineImages = addImagesAtStart(clementineBaseImages, clementineImages);
      adjustPosition = clementineBaseImages.length * cardWidth;
      clementineScrollPosition += adjustPosition;
    }
    
    // Apply the transform
    if (clementineCarousel) {
      clementineCarousel.style.transform = `translateX(-${clementineScrollPosition}px)`;
    }
  }

  onMount(() => {
    console.log('Mookie images found:', mookieBaseImages.length);
    console.log('Clementine images found:', clementineBaseImages.length);
    console.log('Sample mookie image:', mookieBaseImages[0]);
    console.log('Sample clementine image:', clementineBaseImages[0]);
    
    // Initialize Mookie carousel
    if (mookieBaseImages.length > 0) {
      const mookieInit = initializeImages(mookieBaseImages);
      mookieImages = mookieInit.images;
      mookieScrollPosition = mookieInit.startPosition;
      
      if (mookieCarousel) {
        mookieCarousel.style.transform = `translateX(-${mookieScrollPosition}px)`;
      }
    } else {
      console.warn('No Mookie images found in /static/mookie/');
    }
    
    // Initialize Clementine carousel
    if (clementineBaseImages.length > 0) {
      const clementineInit = initializeImages(clementineBaseImages);
      clementineImages = clementineInit.images;
      clementineScrollPosition = clementineInit.startPosition;
      
      if (clementineCarousel) {
        clementineCarousel.style.transform = `translateX(-${clementineScrollPosition}px)`;
      }
    } else {
      console.warn('No Clementine images found in /static/clementine/');
    }
  });
</script>

<h1>Mookie (age: 5)</h1>

<div class="carousel-container" on:wheel={handleMookieWheel}>
  <div class="carousel-track" bind:this={mookieCarousel}>
    {#each mookieImages as image (image.id)}
      <div class="card">
        <img 
          src={image.src} 
          alt={image.alt}
          loading="lazy"
        />
      </div>
    {/each}
  </div>
</div>

<h1>Clementine (age: 2 months)</h1>

<div class="carousel-container" on:wheel={handleClementineWheel}>
  <div class="carousel-track" bind:this={clementineCarousel}>
    {#each clementineImages as image (image.id)}
      <div class="card">
        <img 
          src={image.src} 
          alt={image.alt}
          loading="lazy"
        />
      </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #333;
    margin: 2rem 0 1rem 0;
    font-size: 2rem;
    font-weight: 600;
  }
  
  h1:first-of-type {
    margin-top: 1rem;
  }
  
  .carousel-container {
    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
    cursor: grab;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .carousel-container:active {
    cursor: grabbing;
  }
  
  .carousel-track {
    display: flex;
    gap: 32px;
    height: 100%;
    transition: transform 0.1s ease-out;
    will-change: transform;
  }
  
  .card {
    min-width: 300px;
    height: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  
  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .carousel-track {
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
</style>