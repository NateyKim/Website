<script lang="ts" context="module">
  export type Choice = { name: string; body: string; section?: string; panel?: string };
</script>
<script lang="ts">
  export let items: Choice[];
  export let onSelect: (index: number) => void;
  export let onActivity: (index: number) => void = () => {};
  export let initialSelection = -1;
  export let persistent = false;
  let menuNode: HTMLDivElement;
  let highlighted = initialSelection;
  let keyboardMode = false;
  function highlight(index: number, keyboard: boolean) {
    if (highlighted !== index) onActivity(index);
    keyboardMode = keyboard;
    highlighted = index;
  }
</script>

<svelte:window on:focusin={(event) => { if (!persistent && menuNode && !menuNode.contains(event.target as Node)) highlighted = -1; }} />
<div class="choice-menu" bind:this={menuNode}>
  {#each items as item, index}
    <div class="choice-row" class:highlighted={highlighted === index} style:--order={index} on:pointerenter={() => highlight(index, false)} on:pointerleave={() => { if (!persistent && !keyboardMode) highlighted = -1; }} role="group" aria-label={item.name}>
      <button type="button" class="choice" aria-label={item.name} on:focus={() => highlight(index, true)} on:blur={() => { if (!persistent && keyboardMode) highlighted = -1; }} on:click={() => onSelect(index)}>
        <span class="selection-shape" aria-hidden="true"></span>
        <span class="word">{item.name}</span>
        <span class="marker" aria-hidden="true">◂</span>
      </button>
    </div>
  {/each}
</div>

<style>
  .choice-menu { display: grid; gap: 10px; }
  .choice-row { position: relative; animation: arrive 240ms ease-out both; animation-delay: calc(var(--order) * 35ms); }
  .choice { position: relative; isolation: isolate; border: 0; cursor: pointer; display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 12px; color: white; background: transparent; font-family: 'Arial Black', Impact, Arial, sans-serif; text-align: left; text-shadow: 3px 4px 0 #061735; }
  .word { position: relative; font-size: clamp(25px, 3.3vw, 49px); font-weight: 900; font-style: italic; line-height: 1.05; letter-spacing: -.065em; white-space: nowrap; }
  .selection-shape { position: absolute; z-index: -1; inset: 2px -8px 1px -13px; opacity: 0; background: #53eeff; clip-path: polygon(5% 0, 94% 0, 100% 33%, 93% 45%, 97% 94%, 8% 100%, 0 68%, 7% 54%); transform: translateX(-12px); }
  .selection-shape::after { content: ''; position: absolute; inset: 5px 9px 5px 14px; border: 1px solid #0754fa88; clip-path: polygon(0 0, 95% 0, 100% 100%, 3% 100%); }
  .highlighted .selection-shape { opacity: 1; transform: none; animation: lock-in 170ms ease-out; }
  .highlighted .choice { color: #061735; text-shadow: none; }
  .marker { margin-left: auto; font: 22px Arial, sans-serif; opacity: 0; color: #061735; }
  .highlighted .marker { opacity: 1; }
  .choice:focus-visible { outline: 2px solid white; outline-offset: 7px; }
  @keyframes lock-in { from { opacity: .2; transform: translateX(-12px) skew(-4deg); } to { opacity: 1; transform: none; } }
  @keyframes arrive { from { opacity: 0; translate: -10px 0; } to { opacity: 1; translate: 0 0; } }
  @media (max-width: 1000px) { .word { font-size: clamp(25px, 3.5vw, 40px); } }
  @media (max-width: 700px) { .word { font-size: clamp(24px, 6.4vw, 34px); } .choice { padding: 14px 8px; } }
  @media (prefers-reduced-motion: reduce) { .choice-row, .highlighted .selection-shape { animation: none; } }
</style>
