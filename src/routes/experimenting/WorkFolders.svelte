<script lang="ts">
  import PersonaContent from './PersonaContent.svelte';
  import type { Choice } from './ExperimentMenu.svelte';
  export let items: Choice[];
  export let panel = '';
  export let onSelect: (index:number) => void;
  export let onActivity: (index:number) => void;
  let flipping = false;
  $: active = Math.max(0,items.findIndex(item => item.panel === panel));
  async function flip(index:number) {
    if (flipping || (panel && index === active)) return;
    flipping = true;
    onActivity(index);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise(resolve => setTimeout(resolve,260));
    onSelect(index);
    flipping = false;
  }
</script>
<div class="folder-menu submenu" aria-label="Work folder">
  <div class="folder-spine" aria-hidden="true"></div>
  <div class="page-back" aria-hidden="true"></div>
  <div class="folder-tabs">
    {#each items as item,index}<button class="choice tab" class:active={active === index} aria-pressed={active === index} aria-label={item.name} on:click={() => flip(index)} on:focus={() => onActivity(index)}>{item.name}</button>{/each}
  </div>
  <div class="folder-sheet" class:flipping>
    {#key items[active].panel}<PersonaContent section="work" panel={items[active].panel ?? ''}/>{/key}
  </div>
</div>
<style>
  .folder-menu { position:relative; isolation:isolate; margin:35px 150px 55px 20px; padding:24px 24px 24px 36px; background:#1451b1; box-shadow:12px 15px 0 #001347; transform:perspective(1600px) rotateY(-6deg) rotateZ(-3deg); transform-origin:left top; }
  .folder-spine { position:absolute; left:-18px; top:0; bottom:0; width:28px; background:#032877; }
  .page-back { position:absolute; z-index:-1; inset:-18px 8px 8px 28px; background:#c4e7f6; transform:rotate(1.5deg); box-shadow:4px -6px 0 #eefbff; }
  .folder-tabs { position:absolute; left:100%; top:35px; display:grid; gap:24px; width:92px; }
  .tab { width:92px; min-height:150px; border:0; padding:15px 12px; background:#2285ed; color:white; writing-mode:vertical-rl; font:italic 900 24px/1 var(--font-display); cursor:pointer; clip-path:polygon(0 0,78% 0,100% 12%,100% 90%,78% 100%,0 100%); }
  .tab.active { background:#fffdf5; color:#001347; } .tab:hover { background:#8cf3ff; color:#001347; }
  .tab:focus-visible { outline:3px solid #ff3349; outline-offset:-6px; }
  .folder-sheet { min-height:480px; transform-origin:left center; }
  .flipping { animation:flip 260ms ease-in forwards; }
  @keyframes flip { to { transform:perspective(1000px) rotateY(-75deg); opacity:.25; } }
  @media(max-width:700px) { .folder-menu { margin:30px 48px 35px 4px; padding:14px 8px 14px 14px; transform:rotate(-1deg); box-shadow:5px 7px 0 #001347; } .folder-tabs { width:48px; gap:15px; } .tab { width:48px; font-size:19px; min-height:155px; padding:12px 8px; } }
  @media(prefers-reduced-motion:reduce) { .flipping { animation:none; } }
  @media(orientation:landscape) and (max-height:700px) {
    .folder-menu { margin:25px 80px 35px 12px; padding:18px 16px 18px 25px; transform:perspective(1600px) rotateY(-3deg) rotateZ(-1.5deg); }
    .folder-tabs { width:58px; top:20px; gap:15px; }
    .tab { width:58px; min-height:145px; font-size:21px; padding:12px 8px; }
    .folder-sheet { min-height:360px; }
  }
  .folder-spine { background:radial-gradient(#5eeaff 1px,transparent 1.5px) 0 0/6px 6px,#032877; }
  .tab { background:radial-gradient(#00134744 1px,transparent 1.5px) 0 0/6px 6px,#2285ed; }
  .tab.active { background:#fffdf5; color:#001347; }
  .tab.active::after { content:''; position:absolute; left:0; top:0; width:22px; height:30px; background:#f32949; clip-path:polygon(0 0,100% 0,0 100%); }
  .tab { position:relative; }
</style>

