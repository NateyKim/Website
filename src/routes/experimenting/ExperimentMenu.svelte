<script lang="ts" context="module">
  export type Choice = { name: string; body: string; section?: string; panel?: string };
</script>
<script lang="ts">
  export let items: Choice[];
  export let onSelect: (index: number) => void;
  export let selectedPanel = '';
  export let compact = false;
  let menuNode: HTMLDivElement;
  let highlighted = -1;
  let keyboardMode = false;
</script>

<svelte:window on:focusin={(event) => { if (menuNode && !menuNode.contains(event.target as Node)) highlighted = -1; }} />
<div class="choice-menu" class:compact bind:this={menuNode}>
  {#each items as item, index}
    <div class="choice-row" class:highlighted={highlighted === index || selectedPanel === item.panel} style:--order={index} on:pointerenter={() => { keyboardMode = false; highlighted = index; }} on:pointerleave={() => { if (!keyboardMode) highlighted = -1; }} role="group" aria-label={item.name}>
      <button type="button" class="choice" aria-label={item.name} aria-current={selectedPanel && selectedPanel === item.panel ? 'page' : undefined} on:focus={() => { keyboardMode = true; highlighted = index; }} on:blur={() => { if (keyboardMode) highlighted = -1; }} on:click={() => onSelect(index)}>
        <span class="number">0{index + 1}</span>
        <span class="word" aria-hidden="true">
          {#each Array.from(item.name) as letter, i}
            <span class="letter" class:tile={letter !== ' ' && i % 6 === 1} class:space={letter === ' '} style:--tilt={(i % 3 - 1) * 4 + 'deg'}>{letter === ' ' ? ' ' : letter}</span>
          {/each}
        </span>
        <span class="marker" aria-hidden="true">↗</span>
      </button>
      {#if highlighted === index && !selectedPanel}
        <div class="preview">{item.body}</div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .choice-menu { display: grid; gap: 16px; }
  .choice-row { position: relative; margin-left: calc(var(--order) * 5px); animation: arrive 300ms ease-out both; animation-delay: calc(var(--order) * 45ms); }
  .choice { position: relative; isolation: isolate; border: 0; cursor: pointer; display: flex; align-items: center; gap: 15px; width: 100%; padding: 15px 20px; color: white; background: transparent; font-family: 'Arial Black', Impact, Arial, sans-serif; transform: rotate(-4deg); transition: transform 150ms, color 150ms; text-align: left; }
  .choice::before { content: ''; position: absolute; z-index: -1; inset: 0; background: #061735; clip-path: polygon(2% 10%, 38% 0, 100% 8%, 98% 91%, 59% 100%, 0 88%); transition: background 150ms; }
  .word { display: flex; align-items: baseline; font-size: clamp(23px, 3.15vw, 46px); font-style: italic; line-height: 1.1; letter-spacing: -.055em; white-space: nowrap; }
  .letter { display: inline-block; transform: rotate(var(--tilt)); }
  .tile { color: #061735; background: white; margin: 0 .04em; padding: .01em .035em; }
  .space { width: .25em; }
  .number { color: #53eeff; font: 11px 'Courier New', monospace; flex-shrink: 0; }
  .marker { margin-left: auto; color: #53eeff; opacity: 0; font: 22px Arial, sans-serif; }
  .highlighted .choice { transform: rotate(-2deg) translateX(8px); color: #061735; }
  .highlighted .choice::before { background: #edfaff; }
  .highlighted .tile { background: #061735; color: #53eeff; }
  .highlighted .number, .highlighted .marker { color: #0754fa; opacity: 1; }
  .choice:focus-visible { outline: 3px solid #ffdd45; outline-offset: 5px; }
  .preview { position: absolute; z-index: 10; top: calc(100% + 2px); left: 20px; right: -10px; padding: 14px 18px; color: #edfaff; background: #061735; border-left: 3px solid #53eeff; box-shadow: 4px 4px 0 #53eeff; font: 13px/1.5 Arial, sans-serif; pointer-events: none; animation: arrive 140ms ease-out; }
  .compact .word { font-size: clamp(20px, 2vw, 29px); }
  @keyframes arrive { from { opacity: 0; translate: -14px 5px; } to { opacity: 1; translate: 0 0; } }
  @media (max-width: 700px) { .word { font-size: clamp(23px, 6vw, 34px); } .choice { padding: 13px 15px; gap: 9px; } .number { font-size: 10px; } .choice-row { margin-left: calc(var(--order) * 2px); } .preview { left: 5px; right: 0; } }
  @media (prefers-reduced-motion: reduce) { .choice-row, .preview { animation: none; } .choice, .choice::before { transition: none; } }
</style>
