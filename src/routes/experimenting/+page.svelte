<script lang="ts">
  import { tick } from 'svelte';
  import './pause-tokens.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PersonaContent from './PersonaContent.svelte';
  import PauseGear from './PauseGear.svelte';
  import DepthScene from './DepthScene.svelte';
  import WorkFolders from './WorkFolders.svelte';
  import PauseBackdrop from './PauseBackdrop.svelte';
  import PetSelector from './PetSelector.svelte';
  import ReactiveSignal from './ReactiveSignal.svelte';
  let menuImpulse = 0;
  let eyeX = 330, eyeY = 700;
  let gearAngle = 0;
  let gearSelection = -1;
  function updateGear(index: number) {
    menuImpulse += 1;
    if (index === gearSelection) return;
    let direction = gearSelection < 0 ? 1 : index - gearSelection;
    const count = section ? activeChoices.length : mainChoices.length;
    if (direction > count / 2) direction -= count;
    if (direction < -count / 2) direction += count;
    gearAngle += (Math.sign(direction) || 1) * 30;
    gearSelection = index;
  }
  import ExperimentMenu from './ExperimentMenu.svelte';
  import type { Choice } from './ExperimentMenu.svelte';

  let shell: HTMLDivElement;
  let lastMainChoice = 0;
  const sections: Record<string, { name: string; description: string; choices: Choice[] }> = {
    contact: { name: 'CONTACT ME', description: '', choices: [] },
    research: { name: 'RESEARCH', description: 'Human movement, biosignals, and assistive robotics.', choices: [
      { name: 'GRASP LAB', panel: 'experience', body: 'Research engineering at the University of Pennsylvania.' },
      { name: 'PUBLICATIONS', panel: 'publications', body: 'Research output and collaborative publications.' },
      { name: 'RESEARCH PROJECTS', panel: 'projects', body: 'Exoskeletons, musculoskeletal digital twins, and EMG.' }
    ] },
    work: { name: 'WORK', description: 'Choose the team. Explore the systems behind the work.', choices: [
      { name: 'MAINGEN', panel: 'maingen', body: 'Research Resident / machine learning for robotic end-effector design.' },
      { name: 'TADASHI ROBOTICS', panel: 'tadashi', body: 'Founding Mechanical Engineer / the Ember social-robotics platform.' }
    ] },
    other: { name: 'OTHER PROJECTS', description: 'Experiments beyond the usual lane.', choices: [
      { name: 'VERDIGRIS', panel: 'verdigris', body: 'Assistive ultrasound guidance for lumbar puncture.' },
      { name: 'REHAB DRIVING', panel: 'driving', body: 'A rehabilitative driving simulator.' },
      { name: 'SOCIAL DINOBOT', panel: 'dinobot', body: 'Social robotics and human–robot interaction.' },
      { name: 'MORE PROJECTS', panel: 'additional', body: 'Prosthetics, robot competitions, and creative engineering.' }
    ] },
    cv: { name: 'CV', description: 'The experience and education behind the work.', choices: [
      { name: 'VIEW CV', panel: 'document', body: 'Read the CV inside the interface.' },
      { name: 'DOWNLOAD PDF', panel: 'download', body: 'Save a copy of the CV.' }
    ] },
    beyond: { name: 'BEYOND THE WORK', description: 'The human side. Off the clock, still curious.', choices: [
      { name: 'PETS', panel: 'pets', body: 'Meet Mookie and Clementine.' },
      { name: 'MUSIC', panel: 'music', body: 'Piano and guitar performances.' },
      { name: 'GAMES', panel: 'games', body: 'Games and the worlds around them.' },
      { name: 'FOOD', panel: 'food', body: 'Favorite meals and memorable finds.' },
      { name: 'PHOTOS', panel: 'photos', body: 'Camera roll top picks, collected along the way.' }
    ] }
  };
  const robotChoices: Choice[] = [
    { name: 'RESEARCH', section: 'research', body: sections.research.description },
    { name: 'WORK', section: 'work', body: sections.work.description },
    { name: 'OTHER PROJECTS', section: 'other', body: sections.other.description },
    { name: 'CV', section: 'cv', body: sections.cv.description }
  ];
  const humanChoices: Choice[] = [{ name: 'BEYOND THE WORK', section: 'beyond', body: sections.beyond.description }];
  const mainChoices = [...robotChoices, ...humanChoices, { name: 'CONTACT ME', section: 'contact', body: '' }];
  const petChoices: Choice[] = [{ name: 'CLEMENTINE', panel: 'clementine', body: 'Clementine’s photos and videos.' }, { name: 'MOOKIE', panel: 'mookie', body: 'Mookie’s photo collection.' }];
  $: sectionKey = $page.url.searchParams.get('section') ?? '';
  $: section = sections[sectionKey];
  $: panel = $page.url.searchParams.get('panel') ?? '';
  $: selectedChoice = section?.choices.find(choice => choice.panel === panel);
  $: itemKey = $page.url.searchParams.get('item') ?? '';
  $: selectedPet = panel === 'pets' ? petChoices.find(choice => choice.panel === itemKey) : undefined;
  $: isLeaf = !!selectedChoice && panel !== 'download' && (panel !== 'pets' || !!selectedPet);
  $: petGroup = sectionKey === 'beyond' && panel === 'pets';
  $: activeChoices = petGroup ? petChoices : section?.choices ?? [];
  $: viewTitle = selectedPet?.name ?? selectedChoice?.name ?? section?.name;
  $: viewDescription = selectedPet?.body ?? selectedChoice?.body ?? section?.description;

  async function navigate(nextSection = '', nextPanel = '', nextItem = '') {
    const query = new URLSearchParams();
    if (nextSection) query.set('section', nextSection);
    if (nextPanel) query.set('panel', nextPanel);
    if (nextItem) query.set('item', nextItem);
    await goto('/experimenting' + (query.size ? '?' + query : ''), { noScroll: true, keepFocus: true });
    await tick();
    shell?.querySelector<HTMLElement>('#screen-title')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  async function openMain(index: number) {
    lastMainChoice = index;
    const item = mainChoices[index];
    await navigate(item.section, item.panel);
  }
  async function openSubmenu(index: number) {
    const item = activeChoices[index];
    if (item.panel === 'download') {
      const download = document.createElement('a');
      download.href = '/CV.pdf';
      download.download = 'Nathaniel-Kim-CV.pdf';
      download.click();
      return;
    }
    if (petGroup) await navigate('beyond', 'pets', item.panel);
    else await navigate(sectionKey, item.panel);
  }
  async function backToMain() {
    await navigate();
    await tick();
    shell?.querySelectorAll<HTMLButtonElement>('.choice')[lastMainChoice]?.focus({ preventScroll: true });
  }
  function handleKeys(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (event.altKey || event.ctrlKey || event.metaKey || target?.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key === 'Escape' && section) { event.preventDefault(); void backToMain(); return; }
    if (event.key === 'Escape' && !section) { event.preventDefault(); void goto('/home'); return; }
    if (target?.closest('.persona-content')) return;
    const choices = Array.from(shell?.querySelectorAll<HTMLButtonElement>('.choice') ?? []);
    if (!choices.length) return;
    const current = choices.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let next = current;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = choices.length - 1;
      else {
        const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        next = current < 0 ? direction > 0 ? 0 : choices.length - 1 : (current + direction + choices.length) % choices.length;
      }
      choices[next]?.focus({ preventScroll: true });
    } else if (event.key === 'Enter' && !target?.closest('a,button')) {
      event.preventDefault(); choices[current >= 0 ? current : 0]?.click();
    }
  }
  function alignSignal(node: HTMLDivElement) {
    function align() {
      const stage = node.getBoundingClientRect();
      const gear = node.querySelector('.main-gear circle[r="40"]')?.getBoundingClientRect();
      if (!gear) return;
      node.style.setProperty('--signal-x', ((gear.left + gear.width / 2 - stage.left) / stage.width * 100) + '%');
      node.style.setProperty('--signal-y', ((gear.top + gear.height / 2 - stage.top) / stage.height * 100) + '%');
      const x = gear.left + gear.width / 2 - stage.left, y = gear.top + gear.height / 2 - stage.top;
      eyeX = x / stage.width * 1000; eyeY = y / stage.height * 1000;
      node.style.setProperty('--divide-top', ((x + y * Math.tan(Math.PI / 20)) / stage.width * 100) + '%');
      node.style.setProperty('--divide-bottom', ((x - (stage.height-y) * Math.tan(Math.PI / 20)) / stage.width * 100) + '%');
    }
    const observer = new ResizeObserver(align);
    observer.observe(node);
    window.addEventListener('resize',align);
    requestAnimationFrame(align);
    return { destroy() { observer.disconnect(); window.removeEventListener('resize',align); } };
  }
  function projectLinks(node: HTMLDivElement) {
    async function follow(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#project-"]');
      if (!anchor) return;
      event.preventDefault();
      await navigate(sectionKey, sectionKey === 'work' ? 'tadashi' : 'projects');
      await tick();
      document.getElementById(anchor.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    node.addEventListener('click', follow);
    return { destroy() { node.removeEventListener('click', follow); } };
  }
</script>

<svelte:head>
  <title>Experimenting / V26 — Natey Kim</title>
  <meta name="description" content="Human intent meets robotic motion. V26 brings human signals and robotic motion into a vivid Persona-inspired pause interface." />
</svelte:head>
<svelte:window on:keydown={handleKeys} />

<div class="experiment" class:subsection={!!section} bind:this={shell} tabindex="-1">
  <header class="version-bar">
    {#if section}<button class="back-main" type="button" on:click={backToMain}>← MAIN MENU <kbd>ESC</kbd></button>{:else}<a class="resume" href="/home">← RESUME</a>{/if}
    <span class="version-number">V26</span>
  </header>
  {#if !section}
    <div class="pause-stage split-main" use:alignSignal>
      <div class="robot-plane" aria-hidden="true"></div><div class="human-plane" aria-hidden="true"></div>
      <DepthScene /><div class="paper-edge" aria-hidden="true"></div><div class="entry-beam" aria-hidden="true"></div>
      <div class="signal-divider" aria-hidden="true"><ReactiveSignal vertical divider {menuImpulse} /></div>
      <div class="main-robot-menu" aria-label="Main menu"><ExperimentMenu items={mainChoices} onSelect={openMain} onActivity={updateGear} expressive poster /></div>
      <svg class="diffraction" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <g class="glass-facets">
          <path d={'M'+eyeX+' '+eyeY+'L'+(eyeX-72)+' '+(eyeY+83)+'L'+(eyeX-169)+' '+(eyeY+64)+'Z'} />
          <path d={'M'+(eyeX-72)+' '+(eyeY+83)+'L'+(eyeX-169)+' '+(eyeY+64)+'L'+(eyeX-235)+' '+(eyeY+172)+'Z'} />
          <path d={'M'+(eyeX-84)+' '+(eyeY+107)+'L'+(eyeX-211)+' '+(eyeY+200)+'L'+(eyeX-124)+' '+(eyeY+221)+'Z'} />
          <path d={'M'+(eyeX-121)+' '+(eyeY+235)+'L0 970L74 1000Z'} />
          <path d={'M'+eyeX+' '+eyeY+'L'+(eyeX-15)+' '+(eyeY+154)+'L'+(eyeX-77)+' '+(eyeY+120)+'Z'} />
          <path d={'M'+(eyeX-30)+' '+(eyeY+165)+'L'+(eyeX-88)+' '+(eyeY+133)+'L'+(eyeX-94)+' 1000Z'} />
        </g>
        <g class="glass-cracks">
          <path d={'M'+eyeX+' '+eyeY+'L'+(eyeX-72)+' '+(eyeY+83)+'L'+(eyeX-235)+' '+(eyeY+172)+'L0 970'} />
          <path d={'M'+(eyeX-72)+' '+(eyeY+83)+'L'+(eyeX-84)+' '+(eyeY+107)+'L'+(eyeX-124)+' '+(eyeY+221)+'L74 1000'} />
          <path d={'M'+eyeX+' '+eyeY+'L'+(eyeX-15)+' '+(eyeY+154)+'L'+(eyeX-94)+' 1000'} />
        </g>
      </svg>
      <div class="gear-cutout" aria-hidden="true"><div class="cutout-shard"></div><div class="main-gear"><PauseGear rotation={gearAngle} /></div></div>
    </div>
  {:else}
    <div class="section-stage">
      <PauseBackdrop rotation={gearAngle} />

            {#if isLeaf || petGroup}<button class="back-level" type="button" on:click={() => navigate(sectionKey, selectedPet ? 'pets' : '')}>← {selectedPet ? 'PETS' : section.name}</button>{/if}
      <div class="section-title"><h1 id="screen-title" tabindex="-1">{viewTitle}</h1></div>
      {#if sectionKey === 'contact'}
        <div class="contact-card">
          <a class="contact-link" href="mailto:natey0214@gmail.com"><span>EMAIL</span><span class="contact-detail">natey0214@gmail.com ↗</span></a>
          <a class="contact-link" href="https://www.linkedin.com/in/nateykim" target="_blank" rel="noreferrer"><span>LINKEDIN</span><span class="contact-detail">Natey Kim ↗</span></a>
        </div>
      {:else if sectionKey === 'work'}
        <WorkFolders items={section.choices} {panel} onSelect={openSubmenu} onActivity={updateGear} />
      {:else if isLeaf}
        <div class="leaf-content" class:work-folder={sectionKey === 'work'} use:projectLinks>

          {#key sectionKey + panel + itemKey}<PersonaContent section={sectionKey} {panel} item={itemKey} />{/key}
        </div>
      {:else if petGroup}
        <PetSelector items={activeChoices} onSelect={openSubmenu} onActivity={updateGear} />
      {:else}
        <div class="section-layout">
          <div class="submenu" aria-label={viewTitle + ' submenu'}><ExperimentMenu items={activeChoices} onSelect={openSubmenu} onActivity={updateGear} expressive /></div>
          <div class="submenu-gear"><PauseGear rotation={gearAngle} /></div>
        </div>
      {/if}
    </div>
  {/if}

  <footer class="experiment-footer">
    <span>{#if !isLeaf}<kbd>↑ ↓</kbd> SELECT <kbd>ENTER</kbd> CONFIRM {/if}<kbd>ESC</kbd> {section ? 'MAIN MENU' : 'RESUME'}</span>
  </footer>
</div>

<style>
  .experiment { background:var(--scene-ink); color:var(--scene-paper); font-family:var(--font-reading); }
  .experiment,.experiment * { box-sizing:border-box; }
  .experiment:focus { outline:none; }
  .version-bar { position:relative; z-index:10; display:flex; align-items:center; gap:24px; min-height:56px; padding:4px 4%; background:var(--scene-ink); }
  .version-number { margin-left:auto; color:var(--scene-cyan); font:600 14px var(--font-ui); letter-spacing:.05em; }
  .resume,.back-main { display:inline-flex; align-items:center; min-height:44px; gap:12px; padding:0 4px; border:0; color:var(--scene-paper); background:transparent; font:600 15px var(--font-ui); text-decoration:none; cursor:pointer; touch-action:manipulation; }
  .pause-stage { position:relative; isolation:isolate; min-height:calc(100svh - 108px); overflow:hidden; }
  .experiment-footer { position:relative; z-index:10; min-height:52px; display:flex; align-items:center; padding:8px 4%; background:var(--scene-ink); color:var(--scene-paper); font:600 13px var(--font-ui); letter-spacing:.055em; }
  kbd { display:inline-block; margin-right:6px; padding:2px 6px; border:1px solid #88c5ed88; background:transparent; color:var(--scene-paper); font:600 12px var(--font-ui); border-radius:2px; }
  .experiment-footer kbd:not(:first-child) { margin-left:18px; }
  .section-stage { --scene-blue:#0754fa; --scene-cyan:#8cf3ff; --scene-ink:#001347; --menu-a:#b4faff; --menu-b:#70deff; --menu-c:#c6fdff; position:relative; isolation:isolate; min-height:calc(100svh - 108px); padding:32px 6% 64px; overflow:hidden; background:var(--scene-blue); }
  .section-title { margin:12px 0 40px; }
  .section-title h1 { color:var(--scene-paper); margin:0; font:italic 900 clamp(54px,7vw,100px)/.95 var(--font-display); letter-spacing:-.03em;  }
  .section-title h1:focus { outline:none; }
  .back-level { display:inline-flex; align-items:center; min-height:44px; margin-bottom:12px; padding:0; background:transparent; color:var(--scene-paper); border:0; font:600 14px var(--font-ui); cursor:pointer; }
  .section-layout { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:7%; align-items:center; }
  .submenu { min-width:0; }
  .submenu-gear { height:500px; }
  .leaf-content { max-width:1180px; margin:0 auto; min-width:0; padding:32px; background:var(--scene-ink); border-top:2px solid var(--scene-cyan); }
  button:focus-visible,a:focus-visible { outline:2px solid var(--scene-paper); outline-offset:5px; }
  @keyframes menu-enter { from { opacity:0; translate:20px 0; } to { opacity:1; translate:0 0; } }
  @media(max-width:700px) {
    .version-bar { padding:4px 7%; gap:16px; }
    .pause-stage { min-height:calc(100svh - 108px); }
    .section-stage { padding:24px 7% 48px; }
    .section-title { margin-bottom:30px; } .section-title h1 { font-size:62px; }
    .section-layout { grid-template-columns:1fr; gap:16px; } .submenu-gear { height:280px; width:85%; margin:20px auto; opacity:.65; }
    .leaf-content { padding:20px; } .experiment-footer { padding:10px 7%; font-size:12px; line-height:1.6; }
    .experiment-footer kbd:not(:first-child) { margin-left:10px; }
  }
  .signal-divider { position:absolute; z-index:4; left:49%; top:0; width:9%; height:100%; pointer-events:none; }
  @media(max-width:700px) { .signal-divider { left:91%; top:5%; width:8%; height:92%; opacity:.65; } }

  .split-main { background:#0754fa; perspective:1200px; }
  .robot-plane,.human-plane { position:absolute; inset:0; z-index:-1; }
  .robot-plane { background-size:150% 150%; animation:blue-drift 14s ease-in-out infinite alternate; background:linear-gradient(150deg,#119dff,#0754fa 55%,#001347); }
  .human-plane { background:linear-gradient(155deg,#0964ef,#0033ad 65%,#001347); clip-path:polygon(var(--divide-top,38%) 0,100% 0,100% 100%,var(--divide-bottom,28%) 100%); }
  .main-robot-menu { position:relative; z-index:5; width:62%; padding:11vh 0 12vh; margin-left:36%; text-align:center; transform:perspective(1100px) rotateY(9deg) rotateZ(-6deg); transform-origin:center center; }
  .gear-cutout { position:absolute; z-index:2; top:35%; left:0; width:46%; height:64%; transform:perspective(1500px) rotateZ(12deg) rotateX(54deg) rotateY(-5deg); transform-style:preserve-3d; }
  .gear-cutout::before { content:''; position:absolute; inset:0; background:#001347; clip-path:polygon(0 50%,18% 18%,43% 3%,68% 12%,100% 50%,78% 81%,53% 97%,27% 85%); transform:translate(16px,18px); }
  .cutout-shard { position:absolute; inset:0; background:#f1ffff; clip-path:polygon(0 50%,18% 18%,43% 3%,68% 12%,100% 50%,78% 81%,53% 97%,27% 85%); }
  .cutout-shard::after { content:''; position:absolute; inset:4%; background:var(--scene-cyan); clip-path:polygon(0 50%,18% 18%,43% 3%,68% 12%,100% 50%,78% 81%,53% 97%,27% 85%); }
  .main-gear { position:absolute; inset:4% 15%; }
  .entry-beam { position:absolute; z-index:3; inset:0; pointer-events:none; background:linear-gradient(90deg,#d9ffff44,#8cf3ff08); clip-path:polygon(0 30%,var(--signal-x,33%) var(--signal-y,70%),0 65%); mix-blend-mode:screen; }
  .signal-divider { left:calc(var(--signal-x,33%) - 5%); top:0; width:12%; height:var(--signal-y,70%); transform:rotate(9deg); transform-origin:50% 100%; }
  .signal-divider :global(.reactive-signal) { height:100%; }
  .main-robot-menu :global(.choice) { margin:auto; justify-content:center; }
  .work-folder { position:relative; background:#1656ad; border:0; padding:32px 24px 24px; margin-top:55px; box-shadow:12px 14px 0 #001347; transform:perspective(1400px) rotateY(-3deg) rotateZ(-2deg); }
  .work-folder::before { content:''; position:absolute; left:0; top:-28px; width:36%; height:30px; background:#1656ad; clip-path:polygon(0 0,88% 0,100% 100%,0 100%); }
  @media(max-width:1000px) { .main-robot-menu { width:65%; margin-left:33%; } .gear-cutout { left:3%; width:53%; } }
  @media(max-width:700px) {
    .main-robot-menu { width:78%; margin-left:20%; padding:45px 0 260px; transform:rotate(-3deg); }
    .human-plane { clip-path:polygon(100% 0,100% 100%,55% 100%); opacity:.3; }
    .gear-cutout { width:350px; height:300px; left:-30px; top:66%; opacity:1; }
    .signal-divider { left:calc(var(--signal-x,33%) - 5%); top:0; width:12%; height:var(--signal-y,70%); }
    .work-folder { padding:20px 12px 12px; transform:none; box-shadow:5px 7px 0 #001347; }
  }
  .robot-plane::after { display:none; content:''; position:absolute; inset:-20%; background:repeating-linear-gradient(120deg,transparent 0 180px,#c4ffff15 181px 215px,transparent 216px 350px); animation:light-drift 18s linear infinite alternate; }
  @keyframes blue-drift { to { background-position:100% 100%; } }
  @keyframes light-drift { to { transform:translate(70px,35px); } }
  @media(prefers-reduced-motion:reduce) { .robot-plane,.robot-plane::after { animation:none; } }
  .experiment:not(.subsection) { --scene-cyan:#ffcea9; --scene-paper:#fff8ef; --scene-blue:#244d92; --scene-ink:#061534; }
  .entry-beam { background:linear-gradient(90deg,#fff0d455,#ffdabd12); }
  .diffraction { position:absolute; inset:0; width:100%; height:100%; z-index:4; pointer-events:none; }
  .glass-facets { fill:var(--scene-cyan); stroke:var(--scene-paper); stroke-width:1.8; opacity:.48; filter:drop-shadow(2px 3px 0 #001347); }
  .glass-facets path:nth-child(even) { fill:var(--scene-paper); opacity:.85; }
  .glass-cracks { fill:none; stroke:var(--scene-paper); stroke-width:2.1; opacity:.9; filter:drop-shadow(1px 1px 0 #001347); }
  .contact-card { max-width:900px; margin:60px auto; transform:rotate(-4deg); }
  .contact-link { display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; min-height:110px; padding:20px 30px; color:var(--scene-ink); background:var(--scene-paper); margin-bottom:25px; box-shadow:8px 9px 0 var(--scene-ink); text-decoration:none; }
  .contact-link>span:first-child { font:italic 900 clamp(36px,5vw,66px)/1 var(--font-display); }
  .contact-detail { font:600 20px var(--font-ui); overflow-wrap:anywhere; }
  .contact-link:hover { background:var(--scene-cyan); }
  @media(max-width:700px) { .contact-card { transform:rotate(-2deg); } .contact-link { padding:20px; } }
  @media(orientation:landscape) and (min-width:701px) {
    .main-robot-menu { width:64%; margin-left:34%; padding:clamp(18px,4svh,40px) 0; transform:perspective(1100px) rotateY(7deg) rotateZ(-3deg); }
    .main-robot-menu :global(.expressive) { gap:3px; }
    .main-robot-menu :global(.expressive .word) { font-size:clamp(32px,7.5svh,76px); }
    .main-robot-menu :global(.choice) { min-height:46px; padding:5px 16px; }
    .gear-cutout { left:0; top:24%; width:36%; height:72%; }
    .section-layout { gap:4%; }
    .submenu-gear { height:clamp(220px,55svh,460px); }
  }
  @media(orientation:landscape) and (max-height:520px) {
    .version-bar { min-height:44px; padding:0 4%; }
    .experiment-footer { min-height:36px; padding:4px 4%; font-size:11px; }
    .pause-stage { min-height:calc(100svh - 80px); }
    .main-robot-menu { width:65%; margin-left:34%; padding:10px 0; transform:rotate(-2deg); }
    .main-robot-menu :global(.expressive) { gap:0; }
    .main-robot-menu :global(.expressive .word) { font-size:clamp(26px,7.8svh,40px); }
    .main-robot-menu :global(.choice) { min-height:44px; padding:3px 10px; }
    .main-robot-menu :global(.expressive .choice-row:nth-child(n)) { transform:rotate(-2deg); }
    .main-robot-menu :global(.expressive .choice-row:nth-child(even)) { transform:rotate(2deg); }
    .gear-cutout { width:36%; height:82%; top:13%; left:0; }
    .section-stage { padding:16px 5% 35px; min-height:calc(100svh - 80px); }
    .section-title { margin:6px 0 25px; }
    .section-title h1 { font-size:44px; }
    .contact-card { margin:35px auto; }
    .contact-link { min-height:80px; padding:15px 22px; }
  }
  .paper-edge { position:absolute; z-index:1; pointer-events:none; left:-5%; top:-7%; width:16%; height:69%; background:#fff8ef; clip-path:polygon(0 0,88% 0,81% 9%,89% 13%,77% 23%,82% 25%,67% 36%,71% 39%,57% 53%,62% 57%,39% 72%,44% 77%,8% 100%,0 100%); transform:rotate(-8deg); filter:drop-shadow(7px 9px 0 #001347); }
  .paper-edge::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent 0 3px,#06153409 3px 4px); }
  .cutout-shard { background:#fff8ef; }
  .cutout-shard::after { background:linear-gradient(135deg,#fff8ef22,transparent 50%),var(--scene-cyan); }
  .gear-cutout::before { transform:translate(12px,17px); background:var(--scene-ink); }
  .gear-cutout::after { content:''; position:absolute; inset:-2% 1% 2% -1%; z-index:-1; background:var(--menu-b,#a7d9ff); clip-path:polygon(0 50%,21% 15%,45% 0,70% 13%,100% 51%,76% 84%,52% 100%,24% 84%); transform:rotate(-4deg) translate(-5px,-5px); }
  .contact-link { position:relative; isolation:isolate; border-bottom:3px solid #06153422; clip-path:polygon(0 3%,96% 0,100% 12%,99% 95%,4% 100%,0 89%); transition:translate 160ms ease-out; }
  .contact-link::after { content:''; position:absolute; right:0; top:0; width:25px; height:25px; background:var(--scene-cyan); clip-path:polygon(0 0,100% 100%,0 100%); }
  .contact-link:hover { translate:0 -4px; }
  @media(max-width:700px) { .paper-edge { width:22%; height:50%; opacity:.8; } }
  @media(prefers-reduced-motion:reduce) { .contact-link { transition:none; } }
  .submenu { transform:rotate(-4deg); padding:20px 0; }
  .submenu :global(.expressive .word) { font-size:clamp(32px,4.5vw,66px); }
  .section-title h1 { display:inline-block; transform:rotate(-4deg) skewX(-5deg); text-shadow:4px 5px 0 #001347; }
  .section-stage::after { content:''; position:absolute; z-index:-1; inset:0; pointer-events:none; background:radial-gradient(#001347 1.5px,transparent 1.8px) 0 0/7px 7px; opacity:.24; mask-image:linear-gradient(120deg,black,transparent 50%,black); }
  @media(max-width:700px) { .submenu :global(.expressive .word) { font-size:clamp(32px,8.5vw,44px); } }
  @media(orientation:landscape) and (max-height:520px) { .submenu { padding:0; } .submenu :global(.expressive .word) { font-size:clamp(30px,8svh,42px); } }
  .split-main { --eye-size:clamp(260px,min(43vw,72svh),640px); }
  .gear-cutout { width:var(--eye-size); height:auto; aspect-ratio:1.25; left:calc(34% - var(--eye-size) / 2); top:auto; bottom:8%; }
  .main-robot-menu { width:59%; margin-left:38%; padding-top:12vh; padding-bottom:12vh; }
  .main-robot-menu :global(.poster) { gap:0; }
  .main-robot-menu :global(.poster .choice) { padding:1px 12px; }
  @media(orientation:landscape) {
    .main-robot-menu { padding-top:9svh; padding-bottom:8svh; }
    .gear-cutout { bottom:9%; }
  }
  @media(orientation:landscape) and (max-height:520px) {
    .main-robot-menu { padding:14px 0 16px; }
    .main-robot-menu :global(.poster .choice-row:nth-child(odd)) { transform:rotate(-5deg); }
    .main-robot-menu :global(.poster .choice-row:nth-child(even)) { transform:rotate(4deg); }
  }
  @media(orientation:portrait) and (max-width:700px) {
    .split-main { --eye-size:clamp(270px,72vw,370px); }
    .main-robot-menu { width:78%; margin-left:20%; padding:65px 0 240px; }
    .gear-cutout { left:calc(37% - var(--eye-size) / 2); top:42%; bottom:auto; }
  }
  @media(max-width:700px) and (orientation:portrait) {
    .main-robot-menu { width:70%; margin-left:25%; }
    .main-robot-menu :global(.poster .choice-row:nth-child(odd)) { transform:rotate(-6deg); }
    .main-robot-menu :global(.poster .choice-row:nth-child(even)) { transform:rotate(5deg); }
    .main-robot-menu :global(.poster .word) { font-size:clamp(30px,8.6vw,43px); }
  }
  .glass-facets path { animation:glass-light 7s ease-in-out infinite alternate; }
  .glass-facets path:nth-child(2n) { animation-delay:-2.5s; }
  .glass-facets path:nth-child(3n) { animation-delay:-4.5s; }
  @keyframes glass-light { from { fill-opacity:.5; } to { fill-opacity:.95; } }
  @media(prefers-reduced-motion:reduce) { .glass-facets path { animation:none; } }
</style>








