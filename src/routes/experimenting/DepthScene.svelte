<script lang="ts" context="module">
  let visitPhoto = '';
</script>
<script lang="ts">
  import { onMount } from 'svelte';
  export let onScene: (photo:string, frame:{x:number;y:number;w:number;h:number}) => void = () => {};
  let scene: HTMLDivElement;
  let photo = '';
  let frame = {x:0,y:0,w:1000,h:1000};
  let sourceImage: HTMLImageElement | undefined;
  const photos = ['bench.jpg','bluemountain.jpg','Jamaica.jpg','strawsburg.jpg','coloseeum.jpg','IMG_20230730_211429627_HDR.jpg','IMG_20230725_172908282.jpg','kyoto.jpg','philly.jpg','kaiyukan.jpg','poconos.jpg','tokyo-flame.jpg','tokyo-skyline.jpg','wooded-lake.jpg','gateway-arch.jpg'];
  const focal: Record<string,[number,number]> = {
    'bench.jpg':[.45,.52], 'bluemountain.jpg':[.55,.38], 'Jamaica.jpg':[.52,.6], 'strawsburg.jpg':[.48,.48],
    'coloseeum.jpg':[.36,.64], 'IMG_20230730_211429627_HDR.jpg':[.5,.55], 'IMG_20230725_172908282.jpg':[.48,.42],
    'kyoto.jpg':[.3,.48], 'philly.jpg':[.28,.52], 'kaiyukan.jpg':[.5,.54], 'poconos.jpg':[.4,.65],
    'tokyo-flame.jpg':[.5,.61], 'tokyo-skyline.jpg':[.52,.63], 'wooded-lake.jpg':[.58,.61], 'gateway-arch.jpg':[.51,.46]
  };
  function crop() {
    if(!sourceImage) return;
    const {width,height}=scene.getBoundingClientRect();
    const scale=Math.max(width/sourceImage.naturalWidth,height/sourceImage.naturalHeight)*1.35;
    const w=sourceImage.naturalWidth*scale,h=sourceImage.naturalHeight*scale;
    const [fx,fy]=focal[visitPhoto] ?? [.5,.5];
    const left=Math.max(width-w,Math.min(0,width*.32-fx*w));
    const top=Math.max(height-h,Math.min(0,height*.3-fy*h));
    scene.style.setProperty('--photo-size',w+'px '+h+'px');
    scene.style.setProperty('--photo-position',left+'px '+top+'px');
    frame={x:left/width*1000,y:top/height*1000,w:w/width*1000,h:h/height*1000};
    onScene(photo,frame);
  }
  function palette(image: HTMLImageElement) {
    const canvas=document.createElement('canvas'); canvas.width=32; canvas.height=32;
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    ctx.drawImage(image,0,0,32,32);
    const pixels=ctx.getImageData(0,0,32,32).data;
    const hues=new Array(36).fill(0);
    for(let i=0;i<pixels.length;i+=4) {
      const r=pixels[i]/255,g=pixels[i+1]/255,b=pixels[i+2]/255;
      const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
      if(delta<.12 || max<.18 || min>.85) continue;
      let hue=max===r?((g-b)/delta+6)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;
      hues[Math.floor(hue*6)] += delta*(1-Math.abs((max+min)/2-.5));
    }
    const hue=hues.indexOf(Math.max(...hues))*10+5;
    const root=scene.closest<HTMLElement>('.experiment');
    root?.style.setProperty('--scene-cyan',`hsl(${hue} 75% 80%)`);
    root?.style.setProperty('--scene-blue',`hsl(${hue} 62% 32%)`);
    root?.style.setProperty('--scene-ink',`hsl(${hue} 55% 10%)`);
    root?.style.setProperty('--scene-light',`hsl(${(hue+8)%360} 95% 73%)`);
    root?.style.setProperty('--scene-deep',`hsl(${(hue+345)%360} 80% 8%)`);
    root?.style.setProperty('--gear-body',`hsl(${hue} 72% 53%)`);
    root?.style.setProperty('--gear-vinyl',`hsl(${hue} 60% 13%)`);
    root?.style.setProperty('--gear-label',`hsl(${(hue+25)%360} 80% 78%)`);
    root?.style.setProperty('--menu-a',`hsl(${hue} 75% 86%)`);
    root?.style.setProperty('--menu-b',`hsl(${(hue+25)%360} 70% 82%)`);
    root?.style.setProperty('--menu-c',`hsl(${(hue+335)%360} 65% 90%)`);
    scene.style.setProperty('--photo-shadow',`hsl(${hue} 55% 12% / .83)`);
    scene.style.setProperty('--photo-accent',`hsl(${hue} 80% 80%)`);
  }
  const fragmentGroups = [
    {id:'canopy',panes:[
      'M746 76L817 55L829 96L757 120Z','M825 53L885 69L872 116L835 96Z',
      'M895 71L959 50L977 93L940 116L881 120Z','M770 133L830 110L859 127L813 161Z'
    ]},
    {id:'edge',panes:[
      'M88 115L137 91L157 140L113 159Z','M145 88L181 104L193 148L164 144Z',
      'M105 169L163 154L177 187L127 212Z'
    ]},
    {id:'column',panes:[
      'M871 632L917 609L942 646L899 680Z','M897 693L947 657L966 703L943 738L910 731Z',
      'M859 719L893 700L903 748L877 771Z','M916 746L941 751L962 804L926 792Z'
    ]}
  ];
  onMount(()=>{
    if(!visitPhoto) {
      let previous=''; try { previous=sessionStorage.getItem('pause-photo') ?? ''; } catch {}
      const pool=photos.filter(name=>name!==previous);
      visitPhoto=pool[Math.floor(Math.random()*pool.length)];
      try { sessionStorage.setItem('pause-photo',visitPhoto); } catch {}
    }
    photo='/photosilike/'+visitPhoto;
    const image=new Image(); image.onload=()=>{ sourceImage=image; palette(image); crop(); }; image.src=photo;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    function move(e:PointerEvent) {
      if(motion.matches || e.pointerType==='touch') return;
      scene.style.setProperty('--dx',(e.clientX/innerWidth-.5)*18+'px');
      scene.style.setProperty('--dy',(e.clientY/innerHeight-.5)*12+'px');
    }
    const resize=new ResizeObserver(crop); resize.observe(scene);
    window.addEventListener('pointermove',move,{passive:true});
    return()=>{ resize.disconnect(); image.onload=null; window.removeEventListener('pointermove',move); };
  });
</script>
<div class="depth-scene" bind:this={scene} aria-hidden="true" data-photo={photo}>
  <div class="architecture" style:background-image={photo ? `url("${photo}")` : 'none'}></div>
  <div class="tonal-depth"></div><div class="color-mask"></div>
  <svg class="depth-planes" viewBox="0 0 1000 1000" preserveAspectRatio="none">
    <defs>
      <linearGradient id="plane-light" x2=".2" y2="1"><stop stop-color="var(--scene-light,var(--scene-cyan))" stop-opacity=".75"/><stop offset="1" stop-color="var(--scene-light,var(--scene-cyan))" stop-opacity="0"/></linearGradient>
      <linearGradient id="plane-shadow" x2=".3" y2="1"><stop stop-color="var(--scene-ink)" stop-opacity="0"/><stop offset="1" stop-color="var(--scene-deep,var(--scene-ink))" stop-opacity=".85"/></linearGradient>
      <filter id="ceiling-refraction"><feTurbulence baseFrequency=".015 .04" numOctaves="2" seed="8" result="ripple"/><feDisplacementMap in="SourceGraphic" in2="ripple" scale="20" xChannelSelector="R" yChannelSelector="G"/></filter>
    </defs>
    <g class="far-planes" fill="url(#plane-light)">
      <path d="M0 0H1000V113L738 164L483 95L195 232L0 172Z"/>
      <path d="M-50 215L263 130L572 185L1010 79V175L581 274L277 208L-50 329Z" opacity=".35"/>
    </g>
    <g class="middle-planes" fill="url(#plane-shadow)">
      <path d="M0 543L252 694L501 613L783 746L1000 584V1000H0Z"/>
      <path d="M0 1000L268 772L485 736L672 834L1000 735V1000Z" opacity=".65"/>
    </g>
    <g class="ceiling-reflections" fill="var(--scene-light,var(--scene-cyan))" filter="url(#ceiling-refraction)">
      <path d="M-20 42L112 18L208 39L313 17L465 44L565 16L707 38L845 12L1020 34V59L854 44L715 76L569 48L472 81L315 53L209 71L113 46L-20 75Z"/>
      <path d="M-20 107L89 83L248 115L377 78L493 101L641 72L792 103L891 71L1020 98V113L901 103L799 139L644 109L493 142L380 119L251 151L91 121L-20 138Z" opacity=".6"/>
      <path d="M-20 186L158 153L298 174L436 142L596 170L742 136L910 169L1020 142V164L918 199L746 174L598 207L439 183L301 211L159 188L-20 220Z" opacity=".3"/>
    </g>
  </svg>
  <div class="volume-light"></div><div class="reading-shadow"></div><div class="print-tone"></div>
  <svg class="fragment-clusters" viewBox="0 0 1000 1000" preserveAspectRatio="none">
    <defs>
      <linearGradient id="window-glaze"><stop stop-color="#ffffff" stop-opacity=".3"/><stop offset=".5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="var(--scene-cyan)" stop-opacity=".2"/></linearGradient>
      {#each fragmentGroups as group}{#each group.panes as d,index}<clipPath id={'window-'+group.id+index}><path {d}/></clipPath>{/each}{/each}
    </defs>
    {#each fragmentGroups as group,groupIndex}
      <g class="cluster-parallax" style:--depth={groupIndex*.4+.6}>
        <g class="window-group" data-group={group.id} style:--phase={groupIndex*-3.3+'s'}>
          {#each group.panes as d,index}<g class="photo-window" clip-path={'url(#window-'+group.id+index+')'}>
            {#if photo}<image href={photo} x={frame.x} y={frame.y} width={frame.w} height={frame.h} preserveAspectRatio="none" opacity=".62"/>{/if}
            <path {d} fill="url(#window-glaze)"/>
          </g><path class="window-edge" {d}/>{/each}
        </g>
      </g>
    {/each}
  </svg>
</div>
<style>
  .depth-scene { --dx:0px; --dy:0px; position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; isolation:isolate; background:var(--scene-blue); }
  .architecture { position:absolute; inset:0; background-position:var(--photo-position,center); background-size:var(--photo-size,cover); background-repeat:no-repeat; opacity:.24; transform:translate(var(--dx),var(--dy)) scale(1.03); transition:transform 650ms ease-out; mask-image:linear-gradient(100deg,transparent,#000 28%,#000 60%,transparent); }
  .tonal-depth { position:absolute; inset:0; background:radial-gradient(ellipse at 43% -12%,color-mix(in srgb,var(--scene-light,var(--scene-cyan)) 65%,transparent),transparent 67%),linear-gradient(180deg,transparent 10%,color-mix(in srgb,var(--scene-blue) 55%,transparent) 42%,var(--scene-deep,var(--scene-ink)) 100%); }
  .color-mask { position:absolute; inset:0; background:var(--scene-ink); opacity:.37; clip-path:polygon(var(--divide-top,35%) 0,100% 0,100% 100%,var(--divide-bottom,20%) 100%); }
  .depth-planes,.fragment-clusters { position:absolute; inset:0; width:100%; height:100%; }
  .far-planes { opacity:.4; transform:translate(calc(var(--dx) * .35),calc(var(--dy) * .35)); transition:transform 900ms ease-out; }
  .middle-planes { opacity:.7; transform:translate(calc(var(--dx) * -.4),calc(var(--dy) * -.4)); transition:transform 900ms ease-out; }
  .ceiling-reflections { opacity:.28; animation:surface-light 16s ease-in-out infinite alternate; }
  .volume-light { position:absolute; inset:-12%; background:radial-gradient(ellipse at 37% 8%,color-mix(in srgb,var(--scene-light,var(--scene-cyan)) 32%,transparent),transparent 52%),linear-gradient(118deg,transparent 35%,#eaffff12 39%,transparent 46%); mix-blend-mode:screen; animation:volume-light 19s ease-in-out infinite alternate; }
  .reading-shadow { position:absolute; inset:0; background:radial-gradient(ellipse at 56% 58%,#000b 0%,#0005 20%,transparent 49%); opacity:.32; }
  .print-tone { position:absolute; inset:0; background:radial-gradient(var(--scene-ink) 1.4px,transparent 1.8px) 0 0/7px 7px; opacity:.23; mask-image:linear-gradient(145deg,black,transparent 43%,transparent 72%,black); }
  .cluster-parallax { transform:translate(calc(var(--dx) * var(--depth) * -1),calc(var(--dy) * var(--depth) * -1)); transition:transform 800ms ease-out; }
  .window-group { animation:cluster-drift 11s ease-in-out infinite alternate; animation-delay:var(--phase); }
  .window-edge { fill:none; stroke:var(--scene-paper); stroke-width:.55; opacity:.3; filter:drop-shadow(1px 2px 0 #0008); }
  @keyframes surface-light { from { transform:translate(-10px,-3px); opacity:.22; } to { transform:translate(15px,7px); opacity:.35; } }
  @keyframes volume-light { to { transform:translate(3%,1%) scale(1.04); opacity:.65; } }
  @keyframes cluster-drift { from { transform:translate(0,-3px); } to { transform:translate(2px,3px); } }
  @media(max-width:700px) { .fragment-clusters { opacity:.6; } .ceiling-reflections { opacity:.22; } }
  @media(prefers-reduced-motion:reduce) {
    .ceiling-reflections,.volume-light,.window-group { animation:none; }
    .architecture,.far-planes,.middle-planes,.cluster-parallax { transform:none; transition:none; }
  }
</style>
