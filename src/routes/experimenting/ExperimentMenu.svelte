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
  .choice-menu { display:grid; gap:7px; }
  .choice-row { position:relative; }
  .choice { position:relative; isolation:isolate; display:flex; align-items:center; gap:16px; width:max-content; max-width:100%; min-width:160px; min-height:64px; padding:8px 18px; border:0; background:transparent; color:var(--scene-paper,#f3fdff); text-align:left; cursor:pointer; touch-action:manipulation; }
  .word { position:relative; text-shadow:none; font-family:var(--font-display); font-weight:900; font-style:italic; font-size:clamp(34px,4.6vw,68px); line-height:.98; letter-spacing:-.015em; white-space:normal; min-width:0; overflow-wrap:anywhere; }
  .selection-shape { position:absolute; z-index:-1; inset:2px -16px 0 -12px; opacity:0; background:#f32949; clip-path:polygon(0 75%,92% 0,100% 100%); transform:translateX(-16px) scaleX(.94); transform-origin:left; }
  .selection-shape::after { content:''; position:absolute; bottom:8px; left:7%; right:13%; height:1px; background:#00154f44; transform:rotate(-2deg); }
  .highlighted .selection-shape { opacity:1; transform:none; animation:engage 210ms var(--ease-menu,ease-out); }
  .highlighted .choice { color:#fff; }
  .highlighted .word { text-shadow:none; transform:translateX(6px); }
  .word { transition:transform 150ms ease-out; }
  .marker { flex-shrink:0; margin-left:auto; font-family:var(--font-ui); font-size:26px; opacity:0; color:var(--scene-ink,#00154f); }
  .highlighted .marker { opacity:1; }
  .choice:focus-visible { outline:2px solid var(--scene-paper,#f3fdff); outline-offset:6px; }
  .choice:active { opacity:.8; }
  @keyframes engage { from { opacity:.3; transform:translateX(-16px) scaleX(.94); } to { opacity:1; transform:none; } }
  @media(max-width:1000px) { .word { font-size:clamp(30px,4.3vw,58px); } }
  @media(max-width:700px) { .word { font-size:clamp(32px,8.5vw,42px); } .choice { min-height:62px; padding:9px 12px; } .choice-menu { gap:6px; } }
  @media(min-width:701px) and (max-height:720px) { .word { font-size:clamp(32px,4.2vw,60px); } .choice { min-height:56px; } .choice-menu { gap:2px; } }
  @media(prefers-reduced-motion:reduce) { .highlighted .selection-shape { animation:none; } .word { transition:none; } }
</style>
