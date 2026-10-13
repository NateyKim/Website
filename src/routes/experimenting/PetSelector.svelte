<script lang="ts">
  import ExperimentMenu from './ExperimentMenu.svelte';
  import type { Choice } from './ExperimentMenu.svelte';
  export let items: Choice[];
  export let onSelect: (index: number) => void;
  export let onActivity: (index: number) => void;
  let selected = 0;
  const portraits = [
    { src: '/pets/clementine-portrait.jpg', name: 'CLEMENTINE', key: 'clementine' },
    { src: '/pets/mookie-car.jpg', name: 'MOOKIE', key: 'mookie' }
  ];
  function preview(index: number) { selected = index; onActivity(index); }
</script>

<div class="pet-selection">
  <div class="pet-roster"><ExperimentMenu {items} {onSelect} onActivity={preview} initialSelection={0} persistent /></div>
  <div class="portrait" data-pet={portraits[selected].key} aria-live="polite">
    <div class="portrait-outline" aria-hidden="true"></div>
    {#key selected}
      <img src={portraits[selected].src} alt={portraits[selected].name + ' portrait'} />
      <span class="portrait-name">{portraits[selected].name}</span>
    {/key}
  </div>
</div>

<style>
  .pet-selection { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); gap: 6%; align-items: center; min-height: 540px; }
  .pet-roster { position: relative; z-index: 3; padding-left: 5%; }
  .portrait { position: relative; width: min(100%, 540px); height: 550px; isolation: isolate; transform: rotate(-5deg); }
  .portrait-outline { position: absolute; inset: -12px 16px 12px -14px; z-index: -1; background: #53eeff; clip-path: polygon(8% 0, 100% 3%, 94% 88%, 79% 100%, 0 95%, 0 9%); }
  img { width: 100%; height: 100%; object-fit: cover; object-position: center 38%; filter: saturate(1.05) contrast(1.04); clip-path: polygon(8% 0, 100% 3%, 94% 88%, 79% 100%, 0 95%, 0 9%); animation: portrait-in 180ms ease-out; }
  .portrait-name { position: absolute; right: 0; bottom: 30px; color: #061735; background: white; padding: 10px 20px; font: italic 900 clamp(36px, 4vw, 60px)/1 var(--font-display); letter-spacing: -.025em; transform: rotate(5deg) skewX(-10deg); box-shadow: 4px 4px 0 #00154f; animation: portrait-in 180ms ease-out; }
  @keyframes portrait-in { from { opacity: .3; translate: 12px 0; } to { opacity: 1; translate: 0 0; } }
  @media (max-width: 700px) { .pet-selection { grid-template-columns: 1fr; gap: 25px; min-height: 0; } .pet-roster { padding-left: 0; } .portrait { height: 430px; width: 90%; margin: 15px auto; } }
  @media (prefers-reduced-motion: reduce) { img, .portrait-name { animation: none; } }
  @media(orientation:landscape) and (max-height:700px) {
    .pet-selection { grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); min-height:0; gap:5%; }
    .portrait { height:clamp(210px,55svh,400px); width:90%; margin:10px auto; }
    .portrait-name { font-size:clamp(26px,5svh,42px); bottom:15px; padding:8px 14px; }
    .pet-roster { padding-left:0; }
  }
</style>
