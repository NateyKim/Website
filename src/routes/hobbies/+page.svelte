<script lang="ts">
  const pets = [
    { src: '/pets/mookie-car.jpg', caption: 'Mookie ready for a car ride', type: 'image' },
    { src: '/pets/mookie-yawn.gif', caption: 'Mookie mid-yawn', type: 'image' },
    { src: '/pets/mookie-reindeer.jpg', caption: 'Mookie dressed as a reindeer', type: 'image' },
    { src: '/pets/mookie-costume.jpg', caption: 'Mookie in costume', type: 'image' },
    { src: '/pets/clementine-portrait.jpg', caption: 'Clementine portrait', type: 'image' },
    { src: '/pets/clementine-kitten.jpg', caption: 'Clementine at one year old', type: 'image' },
    { src: '/pets/clementine-halloween.jpg', caption: 'Clementine ready for Halloween', type: 'image' },
    { src: '/pets/clementine-video.mp4', caption: 'Clementine being Clementine', type: 'video' }
  ];
</script>

<svelte:head><title>Hobbies</title></svelte:head>

<main>
  <h1>Hobbies</h1>
  <p class="intro">Gaming, anime, piano, guitar, hiking, photosynthesizing—and spending time with Mookie and Clementine.</p>
  <section>
    <h2>Mookie &amp; Clementine</h2>
    <div class="pet-grid">
      {#each pets as pet}
        <figure>
          {#if pet.type === 'video'}
            <video controls playsinline preload="metadata" aria-label={pet.caption}>
              <source src={pet.src} type="video/mp4" />
              <track kind="captions" src="/pets/clementine-video.vtt" srclang="en" label="English" default />
              Your browser does not support embedded video.
            </video>
          {:else}
            <img src={pet.src} alt={pet.caption} loading="lazy" />
          {/if}
          <figcaption>{pet.caption}</figcaption>
        </figure>
      {/each}
    </div>
  </section>
</main>

<style>
  main { max-width: 1100px; margin: 2rem auto 4rem; padding: 0 1rem; }
  h1, h2, .intro { text-align: center; }
  .intro { margin: 0 auto 2.5rem; color: #555; }
  .pet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; }
  figure { margin: 0; overflow: hidden; border-radius: 10px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,.14); }
  img, video { display: block; width: 100%; height: 300px; object-fit: cover; background: #111; }
  figcaption { padding: .8rem 1rem; text-align: center; color: #444; }
  @media (max-width: 600px) { img, video { height: 360px; } }
</style>
