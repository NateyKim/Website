<script lang="ts" context="module">
  export type Choice = { name: string; body: string; section?: string; panel?: string };
</script>
<script lang="ts">
  export let items: Choice[];
  export let onSelect: (index: number) => void;
  export let onActivity: () => void = () => {};
  export let compact = false;
  export let human = false;
  let menuNode: HTMLDivElement;
  let highlighted = -1;
  let keyboardMode = false;
  function highlight(index: number, keyboard: boolean) {
    if (highlighted !== index) onActivity();
    keyboardMode = keyboard;
    highlighted = index;
  }
</script>

<svelte:window on:focusin={(event) => { if (menuNode && !menuNode.contains(event.target as Node)) highlighted = -1; }} />
<div class="choice-menu" class:compact class:human bind:this={menuNode}>
  {#each items as item, index}
    <div class="choice-row" class:highlighted={highlighted === index} style:--order={index} on:pointerenter={() => highlight(index, false)} on:pointerleave={() => { if (!keyboardMode) highlighted = -1; }} role="group" aria-label={item.name}>
      <button type="button" class="choice" aria-label={item.name} on:focus={() => highlight(index, true)} on:blur={() => { if (keyboardMode) highlighted = -1; }} on:click={() => onSelect(index)}>
        <span class="number">0{index + 1}</span>
        <span class="word" aria-hidden="true">
          {#each Array.from(item.name) as letter, i}
            <span class="letter" class:space={letter === ' '} style:--tilt={(i % 3 - 1) * 2 + 'deg'}>{letter === ' ' ? ' ' : letter}</span>
          {/each}
        </span>
        <span class="marker" aria-hidden="true">↗</span>
        {#if highlighted === index}
          <svg class="electric-arc" viewBox="0 0 500 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 42L60 37L90 47L120 15L140 58L161 25L180 40L240 34L278 52L300 12L326 55L346 30L390 40L500 28"/></svg>
        {/if}
      </button>
    </div>
  {/each}
</div>

<style>
  .choice-menu { display: grid; gap: 18px; }
  .choice-row { position: relative; animation: arrive 250ms ease-out both; animation-delay: calc(var(--order) * 35ms); }
  .choice { position: relative; border: 0; cursor: pointer; display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 0; color: white; background: transparent; font-family: 'Arial Black', Impact, Arial, sans-serif; text-align: left; text-shadow: 2px 3px 0 #061735; transition: color 150ms; }
  .word { display: flex; align-items: baseline; font-size: clamp(23px, 3.15vw, 46px); font-style: italic; line-height: 1.1; letter-spacing: -.055em; white-space: nowrap; }
  .letter { display: inline-block; transform: rotate(var(--tilt)); }
  .space { width: .25em; }
  .number { width: 22px; color: #53eeff; font: 11px 'Courier New', monospace; flex-shrink: 0; text-shadow: none; }
  .marker { margin-left: auto; color: #53eeff; opacity: 0; font: 22px Arial, sans-serif; }
  .choice::after { content: ''; position: absolute; bottom: 5px; left: 34px; right: 0; height: 2px; background: transparent; }
  .highlighted .choice { color: #53eeff; text-shadow: 2px 3px 0 #061735, 0 0 16px #53eeff55; }
  .highlighted .word { animation: energize 380ms ease-out; }
  .highlighted .choice::after { background: #53eeff; box-shadow: 0 0 8px #53eeff66; }
  .highlighted .marker { opacity: 1; }
  .choice:focus-visible { outline: 2px dashed #ffdd45; outline-offset: 5px; }
  .human .choice { color: #061735; text-shadow: 1px 2px 0 #edffff; }
  .human .number { color: #0754fa; }
  .human .word { font-size: clamp(23px, 2.5vw, 36px); }
  .human .highlighted .choice { color: #0754fa; text-shadow: 1px 2px 0 #edffff, 0 0 12px #0754fa44; }
  .human .highlighted .choice::after { background: #0754fa; box-shadow: 0 0 8px #0754fa44; }
  .human .marker { color: #0754fa; }
  .electric-arc { position: absolute; left: 25px; right: 0; top: 0; width: calc(100% - 25px); height: 100%; fill: none; stroke: #caffff; stroke-width: 2; filter: drop-shadow(0 0 5px #53eeff); pointer-events: none; opacity: 0; animation: discharge 380ms ease-out; }
  .human .electric-arc { stroke: #0754fa; filter: drop-shadow(0 0 4px #0754fa); }
  .compact .word { font-size: clamp(20px, 2vw, 29px); }
  @keyframes energize { 0%, 32%, 68% { filter: drop-shadow(0 0 10px #b8ffff); } 18%, 48%, 100% { filter: none; } }
  @keyframes discharge { 0% { opacity: 0; } 12% { opacity: .8; } 27% { opacity: .1; } 43% { opacity: .7; } 65%, 100% { opacity: 0; } }
  @keyframes arrive { from { opacity: 0; translate: -10px 0; } to { opacity: 1; translate: 0 0; } }
  @media (max-width: 700px) { .word { font-size: clamp(23px, 6vw, 34px); } .choice { gap: 9px; } .number { font-size: 10px; } .human .word { font-size: clamp(23px, 5.8vw, 34px); } }
  @media (prefers-reduced-motion: reduce) { .choice-row, .highlighted .word, .electric-arc { animation: none; } .choice { transition: none; } }
</style>
