<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PersonaContent from './PersonaContent.svelte';
  import ReactiveSignal from './ReactiveSignal.svelte';
  let menuImpulse = 0;
  function pulseMenu() { menuImpulse += 1; }
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
    const item = index < robotChoices.length ? robotChoices[index] : humanChoices[index - robotChoices.length];
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
    if (target?.closest('.persona-content')) return;
    const choices = Array.from(shell?.querySelectorAll<HTMLButtonElement>('.choice') ?? []);
    if (!choices.length) return;
    const current = choices.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let next = current;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = choices.length - 1;
      else if (!section && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        next = event.key === 'ArrowRight' ? robotChoices.length : 0;
      } else {
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
  function gearPoints(teeth: number, radius: number) {
    return Array.from({ length: teeth * 4 }, (_, i) => {
      const angle = i * Math.PI * 2 / (teeth * 4);
      const r = i % 4 === 1 || i % 4 === 2 ? radius : radius * .83;
      return Math.cos(angle) * r + ',' + Math.sin(angle) * r;
    }).join(' ');
  }
</script>

<svelte:head>
  <title>Experimenting / V03 — Natey Kim</title>
  <meta name="description" content="Human intent meets robotic motion. V03 explores a biosignal-divided menu and Persona-inspired section menus." />
</svelte:head>
<svelte:window on:keydown={handleKeys} />

<div class="experiment" class:subsection={!!section} bind:this={shell} tabindex="-1">
  <header class="version-bar">
    {#if section}<button class="back-main" type="button" on:click={backToMain}>← BACK TO MAIN MENU <kbd>ESC</kbd></button>{/if}
    <h1>V03</h1><span class="version-caption">EXPERIMENTING / NATEY KIM</span><span class="status">HUMAN ↔ ROBOT</span>
  </header>

  {#if !section}
    <div class="split-stage">
      <div class="robot-background" aria-hidden="true"></div><div class="human-background" aria-hidden="true"></div>
      <div class="blueprint" aria-hidden="true"></div>
      <div class="signal-divider" aria-hidden="true"><ReactiveSignal vertical {menuImpulse} /></div>
      <section class="robot-half" aria-label="Robot side">
        <div class="half-label">01 / ROBOT SIDE</div>
        <h2>ROBOT<span>.</span></h2>
        <p class="half-intro">Build the systems.<br />Translate intent into motion.</p>
        <svg class="robot-study" viewBox="0 0 400 380" fill="none" aria-hidden="true">
          <g transform="translate(280 140)"><g class="gear"><polygon points={gearPoints(16, 85)}/><circle r="45"/><circle r="15"/></g></g>
          <path class="robot-outline" d="M98 344L150 270L105 199L203 102L250 45"/>
          <path class="robot-core" d="M98 344L150 270L105 199L203 102L250 45"/>
          <g class="robot-joints"><circle cx="150" cy="270" r="21"/><circle cx="105" cy="199" r="25"/><circle cx="203" cy="102" r="19"/></g>
          <path class="robot-claw" d="M237 50L218 27L235 4M263 58L294 39L292 12"/>
          <path class="robot-base" d="M62 343H132L151 366H44Z"/>
          <path class="traces" d="M0 74H81L122 115H161M319 269H376V329M12 299H66M327 285H357V344"/>
        </svg>
        <div class="half-menu robot-menu"><ExperimentMenu items={robotChoices} onSelect={openMain} onActivity={pulseMenu} /></div>
        <div class="half-footnote">CIRCUITS / CONTROL / MECHANICS</div>
      </section>
      <div class="mobile-signal" aria-hidden="true"><ReactiveSignal {menuImpulse} /></div>
      <section class="human-half" aria-label="Human side">
        <div class="half-label">02 / HUMAN SIDE</div>
        <h2>HUMAN<span>.</span></h2>
        <p class="half-intro">Follow the signal.<br />And everything that makes us human.</p>
        <svg class="anatomy-study" viewBox="0 0 400 420" fill="none" aria-hidden="true">
          <path class="arm-contour" d="M154 20C122 19 101 48 108 78L142 172C154 203 174 224 203 229L300 340L330 323L247 199C224 172 215 159 207 127L191 59C186 37 176 24 154 20Z"/>
          <path class="bone" d="M153 62L181 170M211 208L306 329M225 202L317 319"/>
          <g class="muscle-bundles">
            <path d="M127 70Q113 136 163 177Q181 161 159 95Q144 62 127 70Z"/>
            <path d="M166 63Q180 125 202 164Q216 129 189 78Q175 51 166 63Z"/>
            <path d="M207 225Q216 278 293 323Q280 280 234 227Z"/>
          </g>
          <path class="tendon" d="M138 80Q146 125 164 164M171 74L195 151M218 238L285 308"/>
          <circle class="elbow" cx="196" cy="190" r="20"/>
          <g class="electrodes"><circle cx="142" cy="114" r="8"/><circle cx="161" cy="145" r="8"/><circle cx="239" cy="262" r="8"/></g>
          <path class="neural-trace" d="M143 114H76L53 92H14M161 145H67L42 170H14M239 262H348L371 239H395"/>
          <text x="10" y="80">EMG / INTENT</text><text x="283" y="373">UPPER LIMB</text>
        </svg>
        <div class="half-menu human-menu"><ExperimentMenu items={humanChoices} onSelect={(index) => openMain(index + robotChoices.length)} onActivity={pulseMenu} human /></div>
        <div class="half-footnote">BIOSIGNALS / MOVEMENT / LIFE</div>
      </section>
      <span class="divider-label" aria-hidden="true">THE SIGNAL CONNECTS US</span>
    </div>
  {:else}
    <div class="section-stage">
      <div class="section-grid" aria-hidden="true"></div>
      <div class="section-topline"><span>HUMAN ↔ ROBOT / {sectionKey.toUpperCase()}</span><span>{isLeaf ? 'FOCUS / ' + viewTitle : 'SELECT A FOCUS ↓'}</span></div>
            {#if isLeaf || petGroup}<button class="back-level" type="button" on:click={() => navigate(sectionKey, selectedPet ? 'pets' : '')}>← {selectedPet ? 'PETS' : section.name}</button>{/if}
      <div class="section-title"><h2 id="screen-title" tabindex="-1">{viewTitle}</h2><p>{viewDescription}</p></div>
      {#if isLeaf}
        <div class="leaf-content" use:projectLinks>
          <div class="leaf-label">FOCUS / {viewTitle}</div>
          {#key sectionKey + panel + itemKey}<PersonaContent section={sectionKey} {panel} item={itemKey} />{/key}
        </div>
      {:else}
        <div class="section-layout">
          <div class="submenu" aria-label={viewTitle + ' submenu'}>
            <ExperimentMenu items={activeChoices} onSelect={openSubmenu} onActivity={pulseMenu} />
          </div>
          <div class="waiting-signal" aria-hidden="true"><span>CHOOSE A<br /><strong>FOCUS.</strong></span><ReactiveSignal {menuImpulse} /><p>INTENT → SIGNAL → ACTION</p></div>
        </div>
      {/if}
    </div>
  {/if}

  <footer class="experiment-footer">
    <span>{#if !isLeaf}<kbd>↑ ↓</kbd> SELECT <kbd>ENTER</kbd> OPEN {/if}{#if section}<kbd>ESC</kbd> MAIN MENU{:else}<kbd>← →</kbd> SWITCH SIDES{/if}</span>
    <span>V03 / HUMAN INTENT × ROBOTIC MOTION</span>
  </footer>
</div>

<style>
  .experiment { --blue: #0754fa; --cyan: #53eeff; --ink: #061735; background: var(--ink); color: white; font-family: Arial, Helvetica, sans-serif; scroll-margin-top: 60px; }
  .experiment, .experiment * { box-sizing: border-box; }
  .experiment:focus { outline: none; }
  .version-bar { display: flex; align-items: center; gap: 25px; padding: 20px 5%; min-height: 90px; border-bottom: 1px solid #53eeff33; }
  h1 { margin: 0; padding: 0 12px; font: 900 38px Arial, sans-serif; letter-spacing: -3px; background: white; color: var(--ink); transform: rotate(-4deg); box-shadow: 4px 4px 0 var(--blue); }
  .version-caption, .status, .half-label, .half-footnote, .divider-label, .section-topline, .leaf-label, .experiment-footer { font: 700 10px 'Courier New', monospace; letter-spacing: 1.5px; }
  .status { color: var(--cyan); margin-left: auto; }
  .split-stage { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; min-height: 880px; }
  .robot-background, .human-background, .blueprint { position: absolute; inset: 0; z-index: -2; pointer-events: none; }
  .robot-background { background: var(--blue); }
  .human-background { background: #8cf3ff; clip-path: polygon(56% 0, 100% 0, 100% 100%, 46% 100%, 49% 53%, 51% 47%, 48% 49%, 53% 42%); }
  .blueprint { z-index: -1; opacity: .2; background-image: linear-gradient(#d1faff88 1px, transparent 1px), linear-gradient(90deg, #d1faff88 1px, transparent 1px); background-size: 38px 38px; }
  .robot-half, .human-half { position: relative; min-width: 0; padding: 42px 12% 58px; }
  .human-half { padding-left: 15%; padding-right: 10%; color: var(--ink); }
  .half-label { display: block; position: relative; z-index: 3; color: var(--cyan); margin-bottom: 17px; }
  .human-half .half-label { color: #0754fa; }

  h2 { position: relative; z-index: 2; margin: 0; font-family: 'Arial Black', Impact, Arial, sans-serif; font-style: italic; font-size: clamp(52px, 7vw, 110px); letter-spacing: -.08em; line-height: 1; transform: rotate(-4deg); }
  h2 span { color: var(--cyan); }
  .human-half h2 span { color: var(--blue); }
  .half-intro { position: relative; z-index: 2; font-size: 14px; line-height: 1.6; margin: 25px 0 60px; }
  .half-menu { position: relative; z-index: 5; margin-top: 30px; }
  .human-menu { margin-top: 30px; }
  .half-footnote { position: absolute; bottom: 30px; font-size: 9px; color: #cefaff; }
  .human-half .half-footnote { color: #0754fa; }
  .robot-study, .anatomy-study { position: absolute; width: 88%; top: 135px; right: -13%; height: 590px; pointer-events: none; opacity: .2; }
  .anatomy-study { right: -8%; width: 78%; opacity: .2; }
  .gear { fill: #061735; stroke: #53eeff; stroke-width: 3; animation: spin 40s linear infinite; }
  .robot-outline { stroke: #061735; stroke-width: 36; stroke-linejoin: bevel; }
  .robot-core { stroke: white; stroke-width: 23; stroke-linejoin: bevel; }
  .robot-joints { fill: var(--ink); stroke: var(--cyan); stroke-width: 4; }
  .robot-claw { stroke: white; stroke-width: 11; }
  .robot-base { fill: var(--ink); stroke: white; stroke-width: 4; }
  .traces { stroke: white; stroke-width: 2; }
  .arm-contour { stroke: #061735; stroke-width: 3; fill: #edfdff99; }
  .bone { stroke: #061735; stroke-width: 9; stroke-linecap: round; }
  .muscle-bundles { stroke: #0754fa; stroke-width: 2; fill: #0754fa77; }
  .tendon { stroke: #0754fa; stroke-width: 1.5; }
  .elbow { fill: #edfdff; stroke: #061735; stroke-width: 3; }
  .electrodes { fill: #061735; stroke: #0754fa; stroke-width: 3; }
  .neural-trace { stroke: #0754fa; stroke-width: 2; }
  .anatomy-study text { fill: #061735; font: 9px 'Courier New', monospace; letter-spacing: 1px; }
  .signal-divider { position: absolute; z-index: 4; left: 46%; top: 0; width: 12%; height: 100%; overflow: visible; pointer-events: none; fill: none; stroke: white; stroke-width: 2; }


  .divider-label { position: absolute; bottom: 75px; left: 49%; writing-mode: vertical-rl; color: var(--ink); font-size: 8px; }
  .experiment-footer { padding: 22px 5%; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 18px; color: #bcd7ef; font-size: 9px; }
  kbd { display: inline-block; background: white; color: var(--ink); padding: 3px 6px; margin: 0 5px; font: 700 9px 'Courier New', monospace; transform: skew(-8deg); }
  .back-main { margin-right: auto; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #53eeff88; background: var(--ink); color: var(--cyan); font: 900 11px Arial, sans-serif; cursor: pointer; transform: rotate(-2deg); }
  .back-main:hover { color: var(--ink); background: white; }
  button:focus-visible { outline: 3px solid #ffdd45; outline-offset: 5px; }
  .subsection { scroll-margin-top: 0; }
  .subsection .version-bar h1 { font-size: 30px; }
  .subsection .version-caption { display: none; }
  .section-stage { position: relative; isolation: isolate; padding: 35px 6% 90px; min-height: calc(100vh - 160px); background: linear-gradient(110deg, #0754fa 0 60%, #00339d 60% 100%); overflow: hidden; }
  .section-grid { position: absolute; inset: 0; z-index: -1; opacity: .15; background-image: linear-gradient(#8cf3ff 1px, transparent 1px), linear-gradient(90deg, #8cf3ff 1px, transparent 1px); background-size: 40px 40px; }
  .section-topline { display: flex; justify-content: space-between; gap: 20px; color: var(--cyan); font-size: 9px; }
  .section-title { margin: 40px 0 55px; }
  .section-title > h2 { border: 0; padding: 0; color: white; background: transparent; font: italic 900 clamp(40px, 7vw, 94px)/.95 'Arial Black', Impact, Arial, sans-serif; letter-spacing: -.055em; cursor: pointer; text-align: left; transform: rotate(-3deg); }
  .section-title p { color: #def6ff; margin-top: 22px; font-size: 14px; line-height: 1.6; }
  .section-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8%; align-items: start; }
  .submenu { padding-top: 15px; min-width: 0; }


  .leaf-content { min-width: 0; padding: 24px; border-top: 3px solid var(--cyan); background: #061735ed; box-shadow: 8px 8px 0 #53eeff33; animation: content-in 220ms ease-out; }
  .leaf-label { color: var(--cyan); font-size: 10px; margin-bottom: 20px; }
  .waiting-signal { padding-top: 20px; color: #ffffff44; }
  .waiting-signal > span { font: italic 900 clamp(35px, 5vw, 80px)/.95 'Arial Black', Arial, sans-serif; letter-spacing: -.06em; }
  .waiting-signal strong { color: #53eeff88; }

  .waiting-signal p { font: 10px 'Courier New', monospace; letter-spacing: 2px; color: var(--cyan); }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes content-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 1050px) { .robot-half { padding-left: 9%; padding-right: 10%; } .human-half { padding-left: 13%; padding-right: 9%; }   }
  @media (max-width: 700px) {
    .version-bar { gap: 16px; padding: 20px 6%; } .version-caption { font-size: 8px; max-width: 135px; line-height: 1.6; } .status { display: none; }
    .split-stage { grid-template-columns: 1fr; } .robot-half, .human-half { padding: 40px 8% 70px; min-height: 600px; } .human-half { background: #8cf3ff; } .human-background { display: none; } .signal-divider { left: 0; top: 595px; height: 55px; width: 100%; transform: rotate(90deg); display: none; } .human-half::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: var(--ink); }
    h2 { font-size: 75px; } .half-intro { margin-bottom: 45px; } .half-menu { margin-top: 0; } .half-footnote { bottom: 25px; font-size: 8px; } .divider-label { display: none; } .robot-study, .anatomy-study { top: 130px; height: 400px; }
    .section-stage { padding: 30px 7% 60px; } .section-layout { grid-template-columns: 1fr; gap: 40px; } .section-title { margin: 30px 0 45px; } .section-title > h2 { font-size: 46px; } .section-topline { font-size: 8px; } .section-topline span:last-child { display: none; }
    .waiting-signal { padding-top: 20px; } .waiting-signal > span { font-size: 52px; } .leaf-content { padding: 18px; } .back-main { font-size: 9px; padding: 10px; gap: 3px; } .back-main kbd { font-size: 8px; } .subsection .version-bar h1 { font-size: 26px; } .experiment-footer { font-size: 8px; line-height: 1.8; }
  }
  @media (prefers-reduced-motion: reduce) { .gear, .leaf-content { animation: none; } }
  .back-level { display: inline-block; margin-top: 30px; padding: 5px 0; color: var(--cyan); background: transparent; border: 0; border-bottom: 1px solid #53eeff66; cursor: pointer; font: 700 11px 'Courier New', monospace; letter-spacing: 1px; }
  .section-title h2 { cursor: default; }
  .section-title h2:focus { outline: none; }
  .leaf-content { max-width: 1180px; margin: 0 auto; }
  .waiting-signal :global(.reactive-signal) { margin: 30px 0; }
  @media (max-width: 700px) {
    .signal-divider { display: none; position: absolute; top: 595px; left: 0; width: 100%; height: 55px; transform: none; z-index: 8; overflow: hidden; }
    .signal-divider :global(.reactive-signal) { width: 100%; height: 55px; transform: rotate(90deg); }
  }
.mobile-signal { display: none; }
@media (max-width: 700px) { .mobile-signal { display: block; height: 70px; background: linear-gradient(#0754fa, #0876d0); padding: 0 6%; } .mobile-signal :global(.reactive-signal) { height: 70px; } }
</style>
