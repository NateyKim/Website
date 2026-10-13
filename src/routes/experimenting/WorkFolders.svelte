<script lang="ts">
  import type { Choice } from './ExperimentMenu.svelte';
  export let items: Choice[];
  export let onSelect: (index:number) => void;
  export let onActivity: (index:number) => void;
  let opening = -1;
  async function open(index:number) {
    if (opening >= 0) return;
    opening = index;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise(resolve => setTimeout(resolve,360));
    onSelect(index);
  }
</script>
<div class="folder-menu submenu" aria-label="Work folders">
  {#each items as item,index}
    <button class="choice folder" class:opening={opening === index} on:click={() => open(index)} on:focus={() => onActivity(index)} on:pointerenter={() => onActivity(index)} aria-label={item.name}>
      <span class="tab">{item.name}</span>
      <span class="sheets" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="cover" aria-hidden="true"><span>{item.name}</span></span>
    </button>
  {/each}
</div>
<style>
  .folder-menu { display:flex; gap:40px; padding:55px 15px 70px; perspective:1400px; }
  .folder { position:relative; isolation:isolate; flex:1; min-width:0; height:340px; border:0; background:#043689; box-shadow:10px 12px 0 #001347; text-align:left; cursor:pointer; transform:rotate(-5deg) rotateY(12deg) rotateX(10deg); transform-style:preserve-3d; transition:transform 200ms ease-out; }
  .folder:nth-child(2) { transform:rotate(4deg) rotateY(-12deg) rotateX(10deg); }
  .tab { position:absolute; z-index:4; bottom:100%; left:0; max-width:100%; min-height:54px; padding:12px 22px 10px; background:#8cf3ff; color:#001347; font:italic 900 clamp(23px,2.8vw,36px)/1 var(--font-display); clip-path:polygon(0 0,92% 0,100% 100%,0 100%); }
  .sheets { position:absolute; inset:14px 16px 15px; }
  .sheets span { position:absolute; inset:0; background:repeating-linear-gradient(#fffdf5 0 30px,#d6e1ea 30px 31px); }
  .sheets span:nth-child(1) { transform:rotate(-2deg) translateY(-6px); } .sheets span:nth-child(2) { transform:rotate(2deg) translateY(-3px); }
  .cover { position:absolute; inset:45px 0 0; background:#186cf0; border-top:3px solid #8cf3ff; transform-origin:center bottom; transition:transform 250ms ease-out; backface-visibility:hidden; }
  .cover span { position:absolute; bottom:30px; left:8%; right:8%; color:#f3fdff; font:italic 900 clamp(30px,4vw,56px)/1 var(--font-display); }
  .folder:hover,.folder:focus-visible { transform:rotate(-2deg) rotateY(5deg) rotateX(5deg) translateY(-8px); }
  .folder:hover .cover,.folder:focus-visible .cover { transform:rotateX(-15deg); }
  .folder:focus-visible { outline:3px solid white; outline-offset:10px; }
  .opening .cover { animation:open-cover 360ms ease-in forwards; }
  @keyframes open-cover { to { transform:rotateX(-100deg); opacity:.15; } }
  @media(max-width:700px) { .folder-menu { flex-direction:column; gap:80px; padding:50px 8px; } .folder { flex:auto; width:100%; height:240px; } .cover span { font-size:36px; } }
  @media(prefers-reduced-motion:reduce) { .folder,.cover { transition:none; } .opening .cover { animation:none; } }
</style>
