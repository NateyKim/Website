<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PersonaContent from './PersonaContent.svelte';
  import PauseGear from './PauseGear.svelte';
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
  <title>Experimenting / V04 — Natey Kim</title>
  <meta name="description" content="Human intent meets robotic motion. V04 explores a biosignal-divided menu and Persona-inspired section menus." />
</svelte:head>
<svelte:window on:keydown={handleKeys} />

<div class="experiment" class:subsection={!!section} bind:this={shell} tabindex="-1">
  <header class="version-bar">
    {#if section}<button class="back-main" type="button" on:click={backToMain}>← MAIN MENU <kbd>ESC</kbd></button>{:else}<a class="resume" href="/home">← RESUME</a>{/if}
    <span class="pause-brand">NATEY KIM</span><h1>V04</h1>
  </header>
  {#if !section}
    <div class="pause-stage">
      <div class="pause-cut" aria-hidden="true"></div><div class="pause-halftone" aria-hidden="true"></div>
      <h2 class="pause-title">PAUSE</h2>
      <div class="hero-gear"><PauseGear rotation={gearAngle} /></div>
      <div class="pause-menu" aria-label="Pause menu"><ExperimentMenu items={mainChoices} onSelect={openMain} onActivity={updateGear} /></div>
      <div class="pause-signal" aria-hidden="true"><ReactiveSignal {menuImpulse} /></div>
    </div>
  {:else}
    <div class="section-stage">
      <div class="section-grid" aria-hidden="true"></div>

            {#if isLeaf || petGroup}<button class="back-level" type="button" on:click={() => navigate(sectionKey, selectedPet ? 'pets' : '')}>← {selectedPet ? 'PETS' : section.name}</button>{/if}
      <div class="section-title"><h2 id="screen-title" tabindex="-1">{viewTitle}</h2></div>
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
        </div>      {/if}
    </div>
  {/if}

  <footer class="experiment-footer">
    <span>{#if !isLeaf}<kbd>↑ ↓</kbd> SELECT <kbd>ENTER</kbd> CONFIRM {/if}<kbd>ESC</kbd> {section ? 'MAIN MENU' : 'RESUME'}</span>
  </footer>
</div>

<style>
  .experiment { --blue: #0754fa; --cyan: #53eeff; --ink: #061735; background: var(--blue); color: white; font-family: Arial, Helvetica, sans-serif; }
  .experiment, .experiment * { box-sizing: border-box; }
  .experiment:focus { outline: none; }
  .version-bar { position: relative; z-index: 10; display: flex; align-items: center; gap: 25px; min-height: 72px; padding: 18px 4%; background: #061735; }
  .version-bar h1 { margin: 0 0 0 auto; font: 700 13px 'Courier New', monospace; color: #53eeff; }
  .pause-brand { font: 700 10px 'Courier New', monospace; letter-spacing: 2px; margin-left: auto; }
  .resume, .back-main { border: 0; padding: 0; color: white; background: transparent; text-decoration: none; font: 900 11px Arial, sans-serif; cursor: pointer; }
  .back-main kbd { margin-left: 10px; }
  .pause-stage { position: relative; isolation: isolate; min-height: calc(100svh - 126px); overflow: hidden; }
  .pause-cut { position: absolute; z-index: -2; inset: 0; background: #003293; clip-path: polygon(0 68%, 100% 14%, 100% 100%, 0 100%); }
  .pause-halftone { position: absolute; z-index: -1; inset: 0; background: radial-gradient(#06173555 1px, transparent 1.5px) 0 0 / 9px 9px; mask-image: linear-gradient(120deg, transparent 15%, black 85%); }
  .pause-title { position: absolute; z-index: 2; top: 32px; left: 5%; margin: 0; font: italic 900 clamp(60px, 7.8vw, 120px)/1 'Arial Black', Impact, Arial, sans-serif; letter-spacing: -.07em; transform: rotate(-7deg); text-shadow: 6px 7px 0 #061735; }
  .hero-gear { position: absolute; left: -8%; top: 17%; width: 62%; height: 82%; }
  .pause-menu { position: relative; z-index: 4; width: 43%; margin-left: 54%; padding: 13vh 0 13vh; transform: rotate(-5deg); }
  .pause-menu :global(.choice-menu) { gap: 22px; }
  .pause-signal { position: absolute; z-index: 3; bottom: 6%; left: 6%; width: 38%; opacity: .7; }
  .pause-signal :global(.reactive-signal) { height: 50px; }
  .experiment-footer { position: relative; z-index: 10; min-height: 54px; display: flex; align-items: center; padding: 12px 4%; background: #061735; font: 700 9px 'Courier New', monospace; letter-spacing: 1px; color: #cbe6ff; }
  kbd { background: white; color: #061735; padding: 3px 6px; margin-right: 6px; font: 700 9px 'Courier New', monospace; }
  .experiment-footer kbd:not(:first-child) { margin-left: 18px; }
  .section-stage { min-height: calc(100svh - 126px); padding: 38px 6% 65px; background: linear-gradient(115deg, #0754fa 0 66%, #003293 66% 100%); overflow: hidden; }
  .section-title { margin: 12px 0 48px; }
  .section-title h2 { margin: 0; font: italic 900 clamp(38px, 6vw, 84px)/1 'Arial Black', Impact, Arial, sans-serif; letter-spacing: -.06em; transform: rotate(-4deg); text-shadow: 4px 5px 0 #061735; }
  .section-title h2:focus { outline: none; }
  .back-level { display: inline-block; margin-bottom: 25px; padding: 0; background: transparent; color: #53eeff; border: 0; font: 700 10px 'Courier New', monospace; cursor: pointer; }
  .section-layout { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 7%; align-items: center; }
  .submenu { min-width: 0; }
  .submenu-gear { height: 510px; opacity: .75; }
  .leaf-content { max-width: 1180px; margin: 0 auto; min-width: 0; padding: 24px; background: #061735ed; border-top: 3px solid #53eeff; }
  button:focus-visible, a:focus-visible { outline: 2px solid white; outline-offset: 5px; }
  @media (max-width: 1000px) { .pause-menu { width: 47%; margin-left: 49%; padding: 12vh 0; } .hero-gear { left: -15%; width: 70%; } .submenu-gear { height: 420px; } }
  @media (max-width: 700px) {
    .version-bar { padding: 18px 7%; gap: 16px; min-height: 64px; } .pause-brand { display: none; }
    .pause-stage { min-height: calc(100svh - 118px); }
    .pause-title { top: 35px; left: 9%; font-size: 68px; }
    .hero-gear { left: -250px; top: 190px; width: 600px; height: 600px; opacity: .24; }
    .pause-menu { width: 84%; margin-left: 8%; padding: 145px 0 110px; transform: none; }
    .pause-menu :global(.choice-menu) { gap: 17px; }
    .pause-signal { left: 8%; width: 84%; bottom: 35px; }
    .section-stage { padding: 30px 7% 50px; min-height: calc(100svh - 118px); }
    .section-title { margin-bottom: 40px; } .section-title h2 { font-size: 42px; }
    .section-layout { grid-template-columns: 1fr; gap: 20px; } .submenu-gear { height: 280px; width: 80%; margin: 20px auto; opacity: .4; }
    .leaf-content { padding: 16px; } .back-main { font-size: 10px; }
    .experiment-footer { padding: 14px 7%; font-size: 8px; line-height: 1.8; }
    .experiment-footer kbd:not(:first-child) { margin-left: 9px; }
  }
</style>