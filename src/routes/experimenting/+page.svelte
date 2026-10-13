<script lang="ts">
  import { tick } from 'svelte';
  import './pause-tokens.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PersonaContent from './PersonaContent.svelte';
  import PauseGear from './PauseGear.svelte';
  import WorkVisual from './WorkVisual.svelte';
  import PauseBackdrop from './PauseBackdrop.svelte';
  import PetSelector from './PetSelector.svelte';
  import ReactiveSignal from './ReactiveSignal.svelte';
  let menuImpulse = 0;
  let gearAngle = 0;
  let gearSelection = -1;
  function updateGear(index: number) {
    menuImpulse += 1;
    if (index === gearSelection) return;
    let direction = gearSelection < 0 ? 1 : index - gearSelection;
    const count = section ? activeChoices.length : 5;
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
  const mainChoices = [...robotChoices, ...humanChoices];
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
  <title>Experimenting / V08 — Natey Kim</title>
  <link rel="preload" href="/experiment/fonts/BarlowCondensed-BlackItalic.ttf" as="font" type="font/ttf" crossorigin="anonymous" />
  <meta name="description" content="Human intent meets robotic motion. V08 pairs a flowing water-like scene with real assistive-robotics work and Persona-inspired menus." />
</svelte:head>
<svelte:window on:keydown={handleKeys} />

<div class="experiment" class:subsection={!!section} bind:this={shell} tabindex="-1">
  <header class="version-bar">
    {#if section}<button class="back-main" type="button" on:click={backToMain}>← MAIN MENU <kbd>ESC</kbd></button>{:else}<a class="resume" href="/home">← RESUME</a>{/if}
    <span class="pause-brand">NATEY KIM</span><span class="version-number">V08</span>
  </header>
  {#if !section}
    <div class="pause-stage">
      <PauseBackdrop rotation={gearAngle} />
      <h1 class="pause-title">PAUSE</h1>
      <div class="signal-divider" aria-hidden="true"><ReactiveSignal vertical divider {menuImpulse} /></div>
      <div class="hero-gear"><PauseGear rotation={gearAngle} /></div>
      <a class="hero-work" href="/experimenting?section=research&amp;panel=projects#project-exoskeleton" aria-label="View the exoskeleton project"><WorkVisual /></a>
      <div class="pause-menu" aria-label="Pause menu"><ExperimentMenu items={mainChoices} onSelect={openMain} onActivity={updateGear} /></div>
      <div class="pause-signal" aria-hidden="true"><ReactiveSignal {menuImpulse} /></div>
    </div>
  {:else}
    <div class="section-stage">
      <PauseBackdrop rotation={gearAngle} />

            {#if isLeaf || petGroup}<button class="back-level" type="button" on:click={() => navigate(sectionKey, selectedPet ? 'pets' : '')}>← {selectedPet ? 'PETS' : section.name}</button>{/if}
      <div class="section-title"><h1 id="screen-title" tabindex="-1">{viewTitle}</h1></div>
      {#if isLeaf}
        <div class="leaf-content" use:projectLinks>

          {#key sectionKey + panel + itemKey}<PersonaContent section={sectionKey} {panel} item={itemKey} />{/key}
        </div>
      {:else if petGroup}
        <PetSelector items={activeChoices} onSelect={openSubmenu} onActivity={updateGear} />
      {:else}
        <div class="section-layout">
          <div class="submenu" aria-label={viewTitle + ' submenu'}><ExperimentMenu items={activeChoices} onSelect={openSubmenu} onActivity={updateGear} /></div>
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
  .pause-brand { margin-left:auto; font:600 14px var(--font-ui); letter-spacing:.12em; color:var(--scene-paper); }
  .resume,.back-main { display:inline-flex; align-items:center; min-height:44px; gap:12px; padding:0 4px; border:0; color:var(--scene-paper); background:transparent; font:600 15px var(--font-ui); text-decoration:none; cursor:pointer; touch-action:manipulation; }
  .pause-stage { position:relative; isolation:isolate; min-height:calc(100svh - 108px); overflow:hidden; }
  .pause-title { position:absolute; z-index:2; top:3%; left:5%; margin:0; font:italic 900 clamp(100px,13vw,195px)/.83 var(--font-display); letter-spacing:-.045em; transform:rotate(-8deg); color:var(--scene-ink); }
  .hero-gear { position:absolute; left:8%; top:21%; width:56%; height:75%; opacity:.8; }
  .hero-work { position:absolute; z-index:3; left:0; top:23%; width:54%; height:72%; transform:perspective(1000px) rotateY(var(--look-x,0deg)) rotateX(var(--look-y,0deg)); transform-origin:60% 50%; transition:transform 90ms ease-out; }
  .pause-menu { position:relative; z-index:4; width:39%; margin-left:58%; padding:15vh 0 12vh; transform:rotate(-9deg); animation:menu-enter 280ms var(--ease-menu); }
  .pause-signal { position:absolute; z-index:3; bottom:5%; left:6%; width:36%; opacity:.75; }
  .pause-signal :global(.reactive-signal) { height:44px; }
  .experiment-footer { position:relative; z-index:10; min-height:52px; display:flex; align-items:center; padding:8px 4%; background:var(--scene-ink); color:var(--scene-paper); font:600 13px var(--font-ui); letter-spacing:.055em; }
  kbd { display:inline-block; margin-right:6px; padding:2px 6px; border:1px solid #88c5ed88; background:transparent; color:var(--scene-paper); font:600 12px var(--font-ui); border-radius:2px; }
  .experiment-footer kbd:not(:first-child) { margin-left:18px; }
  .section-stage { position:relative; isolation:isolate; min-height:calc(100svh - 108px); padding:32px 6% 64px; overflow:hidden; background:var(--scene-blue); }
  .section-title { margin:12px 0 40px; }
  .section-title h1 { color:var(--scene-ink); margin:0; font:italic 900 clamp(54px,7vw,102px)/.95 var(--font-display); letter-spacing:-.03em; transform:rotate(-4deg); }
  .section-title h1:focus { outline:none; }
  .back-level { display:inline-flex; align-items:center; min-height:44px; margin-bottom:12px; padding:0; background:transparent; color:var(--scene-ink); border:0; font:600 14px var(--font-ui); cursor:pointer; }
  .section-layout { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:7%; align-items:center; }
  .submenu { min-width:0; }
  .submenu-gear { height:500px; }
  .leaf-content { max-width:1180px; margin:0 auto; min-width:0; padding:32px; background:var(--scene-ink); border-top:2px solid var(--scene-cyan); }
  button:focus-visible,a:focus-visible { outline:2px solid var(--scene-paper); outline-offset:5px; }
  @keyframes menu-enter { from { opacity:0; translate:20px 0; } to { opacity:1; translate:0 0; } }
  @media(max-width:1000px) { .pause-menu { width:45%; margin-left:52%; padding-top:14vh; } .hero-gear { left:2%; width:62%; } .submenu-gear { height:400px; } }
  @media(max-width:700px) {
    .version-bar { padding:4px 7%; gap:16px; } .pause-brand { display:none; }
    .pause-stage { min-height:calc(100svh - 108px); }
    .pause-title { top:32px; left:8%; font-size:105px; }
    .hero-gear { left:-240px; top:210px; width:620px; height:620px; opacity:.16; }
    .hero-work { left:-150px; top:310px; width:580px; height:400px; opacity:.3; }
    .pause-menu { width:84%; margin-left:8%; padding:135px 0 105px; transform:none; }
    .pause-signal { left:8%; width:84%; bottom:26px; }
    .section-stage { padding:24px 7% 48px; }
    .section-title { margin-bottom:30px; } .section-title h1 { font-size:62px; }
    .section-layout { grid-template-columns:1fr; gap:16px; } .submenu-gear { height:280px; width:85%; margin:20px auto; opacity:.65; }
    .leaf-content { padding:20px; } .experiment-footer { padding:10px 7%; font-size:12px; line-height:1.6; }
    .experiment-footer kbd:not(:first-child) { margin-left:10px; }
  }
  @media(min-width:701px) and (max-height:720px) { .pause-menu { padding:8vh 0 5vh; } .pause-title { font-size:clamp(85px,15vh,130px); } .hero-gear { top:10%; height:88%; } }
  @media(prefers-reduced-motion:reduce) { .pause-menu { animation:none; } }
  .pause-menu :global(.choice-row:first-child:not(.highlighted) .choice) { color:var(--scene-ink); }
  @media(max-width:700px) { .pause-menu :global(.choice-row:first-child:not(.highlighted) .choice) { color:var(--scene-paper); } }
  .hero-work:hover :global(img), .hero-work:focus-visible :global(img) { filter:contrast(1.17) saturate(1.12) drop-shadow(5px 8px 0 #42eeff88); }
  .hero-work:focus-visible { outline:2px solid var(--scene-paper); outline-offset:-16px; }
  @media(prefers-reduced-motion:reduce) { .hero-work { transform:none; transition:none; } }
  .signal-divider { position:absolute; z-index:4; left:49%; top:0; width:9%; height:100%; pointer-events:none; }
  @media(max-width:700px) { .signal-divider { left:91%; top:5%; width:8%; height:92%; opacity:.65; } }
</style>