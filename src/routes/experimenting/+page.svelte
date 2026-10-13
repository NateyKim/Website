<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import PersonaContent from './PersonaContent.svelte';

  const sectionKeys = ['research', 'work', 'other', 'cv', 'beyond'];
  let keyboardSelection = -1;
  let hovered = -1;
  let keyboardMode = false;
  let shell: HTMLDivElement;
  $: screenIndex = sectionKeys.indexOf($page.url.searchParams.get('section') ?? '');
  $: panel = $page.url.searchParams.get('panel') ?? 'experience';
  $: visiblePreview = keyboardMode ? keyboardSelection : hovered;
  const menu = [
    { name: 'RESEARCH', tag: '01 / HUMAN + MACHINE', title: 'Intent into motion.', body: 'Assistive robotics, human movement, and systems that respond to the person behind the signal.', links: [{ label: 'Experience', href: '/experimenting?section=research&panel=experience' }, { label: 'Publications', href: '/experimenting?section=research&panel=publications' }, { label: 'Research projects', href: '/experimenting?section=research&panel=projects' }] },
    { name: 'WORK', tag: '02 / DESIGN + BUILD', title: 'Make it move.', body: 'From robotic end-effectors to rehabilitative products. Design, prototype, test, repeat.', links: [{ label: 'Work experience', href: '/experimenting?section=work&panel=experience' }, { label: 'Work projects', href: '/experimenting?section=work&panel=projects' }] },
    { name: 'OTHER PROJECTS', tag: '03 / SIDE QUESTS', title: 'Let curiosity lead.', body: 'Ideas outside the usual lane. A place for experiments, creative builds, and new directions.', links: [{ label: 'Explore other projects', href: '/experimenting?section=other&panel=projects' }] },
    { name: 'CV', tag: '04 / THE RECORD', title: 'Connect the dots.', body: 'The experience, education, and research behind the work. All in one place.', links: [{ label: 'View CV', href: '/experimenting?section=cv' }, { label: 'Open PDF', href: '/CV.pdf' }] },
    { name: 'BEYOND THE WORK', tag: '05 / OFF THE CLOCK', title: 'More than the work.', body: 'The interests, moments, and little things that make up the person behind the projects.', links: [{ label: 'Explore beyond the work', href: '/experimenting?section=beyond' }] }
  ];
  async function openScreen(index: number, nextPanel = 'experience') {
    keyboardSelection = index;
    hovered = -1;
    await goto('/experimenting?section=' + sectionKeys[index] + '&panel=' + nextPanel, { noScroll: true, keepFocus: true });
    await tick();
    shell?.querySelector<HTMLElement>('#screen-title')?.focus({ preventScroll: true });
    shell?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  async function returnToMenu() {
    await goto('/experimenting', { noScroll: true, keepFocus: true });
    keyboardMode = true;
    await tick();
    shell?.querySelectorAll<HTMLButtonElement>('.menu-link')[Math.max(0, keyboardSelection)]?.focus({ preventScroll: true });
    shell?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function handleKeys(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (event.altKey || event.ctrlKey || event.metaKey || target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'Escape' && screenIndex >= 0) {
      event.preventDefault();
      void returnToMenu();
      return;
    }
    if (screenIndex >= 0) return;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      keyboardMode = true;
      hovered = -1;
      if (event.key === 'Home') keyboardSelection = 0;
      else if (event.key === 'End') keyboardSelection = menu.length - 1;
      else if (keyboardSelection < 0) keyboardSelection = event.key === 'ArrowDown' ? 0 : menu.length - 1;
      else keyboardSelection = (keyboardSelection + (event.key === 'ArrowDown' ? 1 : -1) + menu.length) % menu.length;
      shell?.querySelectorAll<HTMLButtonElement>('.menu-link')[keyboardSelection]?.focus({ preventScroll: true });
    } else if (event.key === 'Enter' && (!target?.closest('a,button') || target?.closest('.menu-link'))) {
      event.preventDefault();
      void openScreen(keyboardSelection >= 0 ? keyboardSelection : hovered >= 0 ? hovered : 0);
    } else if (event.key === 'Escape') {
      keyboardSelection = -1;
      hovered = -1;
      keyboardMode = false;
      shell?.focus({ preventScroll: true });
    }
  }

  function routeProjectLinks(node: HTMLDivElement) {
    node.addEventListener('click', followProject);
    return { destroy() { node.removeEventListener('click', followProject); } };
  }
  function hoverItem(index: number) {
    keyboardMode = false;
    hovered = index;
  }

  async function followProject(event: MouseEvent) {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#project-"]');
    if (!anchor) return;
    event.preventDefault();
    await openScreen(screenIndex, 'projects');
    await tick();
    document.getElementById(anchor.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function gearPoints(teeth: number, radius: number) {
    return Array.from({ length: teeth * 4 }, (_, i) => {
      const angle = i * Math.PI * 2 / (teeth * 4);
      const r = i % 4 === 1 || i % 4 === 2 ? radius : radius * .83;
      return [Math.cos(angle) * r, Math.sin(angle) * r].join(',');
    }).join(' ');
  }
  // Decorative EMG-style bursts, rather than a measurement or live sensor feed.
  const signal = Array.from({ length: 241 }, (_, i) => {
    const burst = Math.exp(-Math.pow((i - 54) / 15, 2)) + .8 * Math.exp(-Math.pow((i - 151) / 22, 2));
    const amplitude = (Math.sin(i * 2.7) + .6 * Math.sin(i * 1.3)) * (3 + burst * 25);
    return (i === 0 ? 'M' : 'L') + (i * 3) + ',' + (60 + amplitude).toFixed(2);
  }).join(' ');
</script>

<svelte:head>
  <title>Experimenting / V01 — Natey Kim</title>
  <meta name="description" content="Natey Kim's visual playground. V01 connects electric color, dynamic menus, gears, circuit traces, and biosignals." />
</svelte:head>

<svelte:window on:keydown={handleKeys} />
<div class="experiment" bind:this={shell} tabindex="-1">
  <header class="version-bar">
    <h1>V01</h1>
    <span>EXPERIMENTING / NATEY KIM</span>
    <span class="status"><i></i> HUMAN × MACHINE</span>
  </header>

  <div class="stage" class:in-section={screenIndex >= 0}>
    <div class="stripe stripe-one" aria-hidden="true"></div>
    <div class="stripe stripe-two" aria-hidden="true"></div>
    <div class="grid" aria-hidden="true"></div>
    <div class="halftone" aria-hidden="true"></div>
    <div class="ink-cut" aria-hidden="true"></div>
    <div class="ghost-type" aria-hidden="true">SIGNAL<br />FLOW.</div>

    <svg class="circuitry" viewBox="0 0 1400 1100" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
      <g class="traces">
        <path d="M0 140H160L215 195H650L750 95H1130V0M0 160H145L200 215H650L770 115H1110V0M0 180H130L185 235H665L805 95H1065V0"/>
        <path d="M1400 310H1270L1210 370H1150V560L1080 630H1010M1400 332H1280L1232 380V576L1158 650H1010M1400 354H1300L1255 399V590L1175 675H1065"/>
        <path d="M0 860H225L310 945H750L865 830H1400M0 885H205L290 970H775L890 855H1400M0 910H190L275 995H798L912 880H1400"/>
        <path d="M1200 1100V960L1120 880M1175 1100V975L1103 903M40 1100V1050L105 985V820L150 775H320"/>
      </g>
      <g class="vias">
        <circle cx="1010" cy="630" r="7"/><circle cx="1010" cy="650" r="7"/><circle cx="1065" cy="675" r="7"/><circle cx="320" cy="775" r="7"/><circle cx="650" cy="195" r="5"/>
      </g>
      <g class="chip" transform="translate(1160 185)">
        <rect width="94" height="74" rx="3"/><rect x="17" y="17" width="60" height="40"/>
        <path d="M10 0V-17M28 0V-17M46 0V-17M64 0V-17M82 0V-17M10 74V91M28 74V91M46 74V91M64 74V91M82 74V91M0 15H-17M0 37H-17M0 59H-17M94 15H111M94 37H111M94 59H111"/>
      </g>
    </svg>

    {#if screenIndex === -1}
    <div class="intro">
      <span class="eyebrow">EXPERIMENT 01 / SIGNAL → SYSTEM</span>
      <span class="name-stamp">NATEY KIM / RESEARCH ENGINEER</span>
      <h2>HUMAN.<br /><span>MACHINE.</span></h2>
      <p>Human intent. Mechanical motion.<br />A little more voltage in the interface.</p>
    </div>

    <div class="hardware" aria-hidden="true">
      <div class="orbit-ring"></div>
      <span class="hardware-tag">ASSEMBLY / NK—01</span>
      <svg class="mechanism" viewBox="0 0 560 590" fill="none">
        <g class="human-arm">
          <path d="M-20 181C15 165 36 157 64 154L137 122C160 109 181 100 194 105L235 85L273 65C282 60 289 69 282 77L252 97L296 74C306 70 313 81 304 87L261 109L308 93C319 90 323 102 312 107L268 124L306 115C317 114 319 126 309 131L254 149L225 168C209 181 187 180 170 171L99 201C69 215 38 237-20 252Z" />
          <path class="muscle" d="M17 192Q89 182 166 145M18 218Q98 200 167 159M192 127L220 141M184 139L209 157"/>
          <path class="bio-wire" d="M86 181L114 166L132 173L151 146L170 146M318 113L335 113L349 96L373 96"/>
          <circle class="electrode" cx="114" cy="166" r="7"/><circle class="electrode" cx="151" cy="146" r="7"/>
          <text x="20" y="263">HUMAN / NEUROMUSCULAR INTENT</text>
        </g>
        <path class="arm-shadow" d="M242 518L330 405 255 292 339 190 387 96"/>
        <path class="arm" d="M242 518L330 405 255 292 339 190 387 96"/>
        <path class="highlight" d="M233 512L319 405 244 292 328 190 376 96"/>
        <g class="joint"><circle cx="330" cy="405" r="27"/><circle cx="255" cy="292" r="32"/><circle cx="339" cy="190" r="25"/></g>
        <g class="center"><circle cx="330" cy="405" r="8"/><circle cx="255" cy="292" r="10"/><circle cx="339" cy="190" r="7"/></g>
        <path class="gripper" d="M369 104L352 66 381 36M398 114L433 88 434 43"/>
        <path class="base" d="M191 519H288L311 551H170Z"/>
        <g transform="translate(156 333)">
          <g class="gear gear-large">
            <polygon points={gearPoints(16, 108)}/>
            <circle class="gear-cutout" r="61"/><circle r="25"/>
            {#each [0, 60, 120, 180, 240, 300] as angle}
              <path d="M31 0H57" transform={'rotate(' + angle + ')'} />
            {/each}
          </g>
        </g>
        <g transform="translate(98 467)">
          <g class="gear gear-small"><polygon points={gearPoints(12, 57)}/><circle class="gear-cutout" r="28"/><circle r="12"/></g>
        </g>
        <g class="annotations">
          <path d="M341 190H445L481 155H548M154 227V183L98 127H18M332 405H461L495 439H548"/>
          <circle cx="341" cy="190" r="5"/><circle cx="154" cy="227" r="5"/>
          <text x="464" y="145">ACTUATE</text><text x="19" y="114">TRANSMIT</text><text x="472" y="463">ADAPT</text>
        </g>
      </svg>
      <span class="hardware-caption">INTENT ↗ SIGNAL ↗ MOTION</span>
    </div>

    <div class="menu-zone">
      <div class="menu-hint"><span>INDEX / 05</span><span>HOVER TO EXPLORE ↙</span></div>
      <div class="selector" aria-label="Portfolio sections">
        {#each menu as item, index}
          <div class="menu-row" class:is-selected={visiblePreview === index} style:--i={index} on:pointerenter={() => hoverItem(index)} on:pointerleave={() => hovered = -1} role="group" aria-label={item.name}>
            <button type="button" class="menu-link" aria-describedby={'preview-' + index} aria-label={item.name} on:focus={() => { keyboardSelection = index; keyboardMode = true; hovered = -1; }} on:click={() => openScreen(index)}>
              <span class="index">0{index + 1}</span>
              <span class="menu-name" aria-hidden="true">
                {#each Array.from(item.name) as letter, letterIndex}
                  <span class="letter" class:tile={letter !== ' ' && letterIndex % 5 === 1} class:accent={letter !== ' ' && letterIndex % 7 === 3} class:space={letter === ' '} style:--tilt={(letterIndex % 3 - 1) * 5 + 'deg'} style:--rise={(letterIndex % 4 === 0 ? -2 : 0) + 'px'} style:--letter-order={letterIndex}>{letter === ' ' ? ' ' : letter}</span>
                {/each}
              </span>
              <span class="arrow" aria-hidden="true">➤</span>
            </button>
            <section class="detail" id={'preview-' + index} aria-label={item.name + ' preview'}>
              <span class="detail-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <div class="detail-links">
                {#each item.links as link}
                  <a href={link.href}>{link.label}<span aria-hidden="true">↗</span></a>
                {/each}
              </div>
            </section>
          </div>
        {/each}
      </div>
    </div>

    {:else}
      <div class="section-shell">
        <aside class="screen-sidebar" aria-label="Experiment navigation">
          <button class="back-button" type="button" on:click={returnToMenu}>← MAIN MENU <kbd>ESC</kbd></button>
          {#each menu as item, index}
            <button type="button" class:current={screenIndex === index} aria-current={screenIndex === index ? 'page' : undefined} on:click={() => openScreen(index)}>
              <span>0{index + 1}</span>{item.name}<span aria-hidden="true">↗</span>
            </button>
          {/each}
          <div class="sidebar-signal" aria-hidden="true"><svg viewBox="0 0 720 120"><path d={signal}/></svg><span>HUMAN ↔ ROBOT</span></div>
        </aside>
        <div class="section-body">
          <div class="section-heading"><span>{menu[screenIndex].tag}</span><h2 id="screen-title" tabindex="-1">{menu[screenIndex].name}</h2><p>{menu[screenIndex].body}</p></div>
          {#if screenIndex === 0 || screenIndex === 1}
            <div class="section-tabs" aria-label="Section views">
              {#each menu[screenIndex].links as link}
                <a href={link.href} class:tab-active={panel === (new URL(link.href, 'https://local.invalid')).searchParams.get('panel')} aria-current={panel === (new URL(link.href, 'https://local.invalid')).searchParams.get('panel') ? 'page' : undefined}>{link.label} ↗</a>
              {/each}
            </div>
          {/if}
          <div class="content-wrapper" use:routeProjectLinks role="group" aria-label="Portfolio content">
            {#key sectionKeys[screenIndex] + panel}
              <PersonaContent section={sectionKeys[screenIndex]} {panel} />
            {/key}
          </div>
        </div>
      </div>
    {/if}
    <div class="biosignal">
      <div class="signal-label"><span><i></i> BIO / SIGNAL</span><span>EMG-INSPIRED / VISUAL STUDY</span></div>
      <div class="signal-window" aria-hidden="true">
        <div class="signal-grid"></div>
        <svg viewBox="0 0 720 120" preserveAspectRatio="none">
          <path class="baseline" d="M0 60H720"/>
          <path class="wave-glow" d={signal}/><path class="wave" d={signal}/>
        </svg>
        <div class="scan-line"></div>
      </div>
      <div class="signal-scale"><span>INTENT</span><span>TRANSLATE</span><span>ACTUATE ↗</span></div>
    </div>

    <div class="stage-footer"><span class="control-hints"><kbd>↑ ↓</kbd> EXPLORE <kbd>ENTER</kbd> OPEN <kbd>ESC</kbd> BACK</span><span>V01 / EXPLORATION IN PROGRESS</span></div>
  </div>
  <footer class="experiment-footer"><span>V01 / COLOR + TYPE + MOTION</span><a href="/home">Back to the portfolio ↗</a></footer>
</div>

<style>
  .experiment { --blue: #0754fa; --cyan: #53eeff; --ink: #061735; background: var(--ink); color: white; font-family: Arial, Helvetica, sans-serif; }
  .experiment, .experiment * { box-sizing: border-box; }
  .version-bar { min-height: 86px; display: flex; align-items: center; gap: 28px; padding: 18px 5%; border-bottom: 1px solid #ffffff33; }
  h1 { margin: 0; font-size: 38px; font-weight: 900; letter-spacing: -3px; }
  .version-bar > span, .eyebrow, .detail-tag, .stage-footer, .experiment-footer, .hardware-caption, .hardware-tag, .menu-hint, .signal-label, .signal-scale { font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; }
  .status { margin-left: auto; display: flex; align-items: center; gap: 9px; color: var(--cyan); }
  .status i, .signal-label i { display: inline-block; width: 6px; height: 6px; background: var(--cyan); }
  .stage { position: relative; isolation: isolate; overflow: hidden; min-height: 1080px; background: var(--blue); padding: 50px 7% 90px; }
  .stripe, .grid, .circuitry, .ghost-type { position: absolute; z-index: -1; pointer-events: none; }
  .stripe-one { inset: 0; background: var(--cyan); clip-path: polygon(79% 0, 100% 0, 100% 48%, 57% 100%, 38% 100%); }
  .stripe-two { inset: 0; background: #002a8c; clip-path: polygon(100% 25%, 100% 100%, 59% 100%); }
  .grid { inset: 0; opacity: .18; background-image: linear-gradient(#8ccfff66 1px, transparent 1px), linear-gradient(90deg, #8ccfff66 1px, transparent 1px); background-size: 38px 38px; }
  .circuitry { inset: 0; width: 100%; height: 100%; }
  .traces { stroke: #c0faff; stroke-width: 2; opacity: .3; }
  .vias { stroke: var(--cyan); stroke-width: 2; fill: var(--ink); }
  .chip { stroke: var(--ink); stroke-width: 2; opacity: .4; }
  .ghost-type { right: -15px; top: 40px; font-size: clamp(100px, 16vw, 235px); font-weight: 900; line-height: .78; letter-spacing: -12px; color: transparent; -webkit-text-stroke: 2px #ffffff44; transform: rotate(-12deg); }
  .intro { position: relative; z-index: 2; max-width: 650px; }
  .eyebrow { display: inline-block; padding: 9px 13px; color: var(--ink); background: var(--cyan); transform: rotate(-3deg); }
  h2 { margin: 27px 0 20px; font-size: clamp(68px, 8.6vw, 124px); line-height: .86; letter-spacing: -.075em; font-weight: 900; font-style: italic; transform: rotate(-5deg); transform-origin: left; }
  h2 span { color: var(--cyan); text-shadow: 6px 6px 0 var(--ink); }
  .intro p { margin: 30px 0 36px; font-size: 15px; line-height: 1.55; }
  .hardware { position: absolute; z-index: 0; width: min(49vw, 630px); height: 660px; top: 165px; right: 2%; pointer-events: none; transition: opacity 200ms; }
  .orbit-ring { position: absolute; border: 18px solid #ffffff99; border-left-color: transparent; border-bottom-color: transparent; border-radius: 50%; top: 9%; left: 7%; width: 87%; aspect-ratio: 1; transform: rotate(-35deg); }
  .mechanism { position: absolute; width: 100%; height: 100%; filter: drop-shadow(12px 14px 0 #002a8c44); }
  .arm-shadow { stroke: var(--ink); stroke-width: 52; stroke-linejoin: bevel; }
  .arm { stroke: white; stroke-width: 32; stroke-linejoin: bevel; }
  .highlight { stroke: var(--cyan); stroke-width: 7; }
  .joint { fill: var(--ink); stroke: white; stroke-width: 6; }
  .center { fill: var(--cyan); }
  .gripper { stroke: var(--ink); stroke-width: 16; }
  .base { fill: var(--ink); stroke: white; stroke-width: 6; }
  .gear { fill: var(--ink); stroke: var(--cyan); stroke-width: 3; animation: spin 40s linear infinite; }
  .gear-cutout { fill: var(--blue); }
  .gear-small { animation-direction: reverse; animation-duration: 30s; }
  .annotations { stroke: white; stroke-width: 1; }
  .annotations text { stroke: none; fill: white; font: 10px 'Courier New', monospace; letter-spacing: 2px; }
  .hardware-tag { position: absolute; right: 10%; top: 6%; background: var(--ink); padding: 9px 13px; color: var(--cyan); transform: rotate(-7deg); }
  .hardware-caption { position: absolute; bottom: 0; right: 15%; color: var(--ink); background: var(--cyan); padding: 10px; transform: rotate(-5deg); }
  .menu-zone { position: relative; z-index: 4; width: min(560px, 52%); }
  .menu-hint { display: flex; justify-content: space-between; gap: 20px; font-size: 9px; margin-bottom: 22px; color: #ceefff; }
  .selector { display: grid; gap: 13px; transform: rotate(-5deg); transform-origin: left; }
  .menu-row { position: relative; margin-left: calc(var(--i) * 10px); }
  .menu-link { display: flex; align-items: center; gap: 14px; width: 100%; padding: 16px 24px; color: white; background: var(--ink); text-align: left; text-decoration: none; transform: skewX(-12deg); transition: transform 180ms, background 180ms, color 180ms, box-shadow 180ms; }
  .menu-link > span { transform: skewX(12deg); }
  .menu-row.is-selected > .menu-link, .menu-row.is-selected > .menu-link { background: white; color: var(--ink); transform: skewX(-12deg) translateX(12px); box-shadow: -9px 7px 0 var(--cyan); }
  a:focus-visible { outline: 3px solid #ffdd45; outline-offset: 5px; }
  .index { font: 12px 'Courier New', monospace; flex-shrink: 0; }
  .menu-name { font-size: clamp(22px, 2.8vw, 40px); font-weight: 900; font-style: italic; letter-spacing: -.06em; white-space: nowrap; }
  .arrow { margin-left: auto; font-size: 26px; }
  .detail { display: none; position: absolute; left: calc(100% + 28px); top: 50%; width: clamp(260px, 27vw, 390px); padding: 25px 28px; background: var(--ink); box-shadow: 9px 9px 0 var(--cyan); transform: translateY(-50%) rotate(5deg); animation: reveal 180ms ease-out; }
  /* Bridge the gap so the preview stays open while moving into its links. */
  .detail::before { content: ''; position: absolute; right: 100%; top: -20px; bottom: -20px; width: 40px; }
  .menu-row.is-selected > .detail, .menu-row.is-selected > .detail { display: block; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) > .detail { display: none; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) > .menu-link { background: var(--ink); color: white; transform: skewX(-12deg); box-shadow: none; }
  .stage:has(.menu-row.is-selected) .hardware, .stage:has(.menu-row.is-selected) .hardware { opacity: .35; }
  .detail-tag { color: var(--cyan); font-size: 10px; }
  h3 { margin: 12px 0; font-size: 29px; letter-spacing: -1px; }
  .detail p { font-size: 14px; line-height: 1.65; color: #d9e6ff; margin-bottom: 20px; }
  .detail-links { display: grid; }
  .detail-links a { color: var(--cyan); display: flex; justify-content: space-between; gap: 15px; font-size: 13px; font-weight: 700; text-decoration: none; border-top: 1px solid #ffffff33; padding: 12px 0; }
  .detail-links a:hover { color: white; }
  .biosignal { position: relative; z-index: 1; margin-top: 76px; background: #061735e8; padding: 17px 20px 12px; border: 1px solid #53eeff88; box-shadow: 7px 7px 0 #001b6044; }
  .signal-label, .signal-scale { display: flex; justify-content: space-between; gap: 16px; font-size: 9px; color: var(--cyan); }
  .signal-label > span:first-child { display: flex; align-items: center; gap: 9px; }
  .signal-window { position: relative; height: 85px; overflow: hidden; margin: 12px 0; }
  .signal-grid { position: absolute; inset: 0; background-image: linear-gradient(#53eeff18 1px, transparent 1px), linear-gradient(90deg, #53eeff18 1px, transparent 1px); background-size: 20px 20px; }
  .signal-window svg { position: relative; width: 100%; height: 100%; fill: none; }
  .baseline { stroke: #53eeff33; stroke-width: 1; }
  .wave { stroke: var(--cyan); stroke-width: 1.5; }
  .wave-glow { stroke: #53eeff44; stroke-width: 5; }
  .scan-line { position: absolute; top: 0; bottom: 0; width: 50px; background: linear-gradient(90deg, transparent, #53eeff22); border-right: 1px solid var(--cyan); animation: scan 6s linear infinite; }
  .signal-scale { color: #a3bde1; font-size: 8px; }
  .stage-footer { position: absolute; bottom: 25px; left: 7%; right: 7%; display: flex; justify-content: space-between; gap: 20px; font-size: 9px; }
  .experiment-footer { display: flex; align-items: center; justify-content: space-between; gap: 25px; padding: 25px 5%; font-size: 10px; }
  .experiment-footer a { color: var(--cyan); text-decoration: none; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scan { from { left: -50px; } to { left: 100%; } }
  @keyframes reveal { from { opacity: 0; translate: -8px 0; } to { opacity: 1; translate: 0 0; } }
  @media (min-width: 1400px) { .stage { padding-left: max(7%, calc((100vw - 1200px) / 2)); padding-right: max(7%, calc((100vw - 1200px) / 2)); } .hardware { right: max(2%, calc((100vw - 1320px) / 2)); } .menu-zone { width: 560px; } }
  @media (max-width: 900px) { .hardware { right: -100px; width: 480px; opacity: .6; } .menu-zone { width: 53%; } .menu-link { padding: 15px 18px; gap: 10px; } .detail { width: 270px; padding: 20px; } .stage-footer span:last-child { display: none; } }
  @media (max-width: 700px) {
    .version-bar { gap: 20px; padding: 16px 6%; } .version-bar > span { font-size: 9px; letter-spacing: 1px; } .status { display: none; }
    .stage { padding: 40px 7% 70px; min-height: 1080px; } h2 { font-size: clamp(60px, 15vw, 96px); } .eyebrow { font-size: 9px; } .intro p { font-size: 14px; }
    .hardware { width: 350px; height: 440px; top: 130px; right: -180px; opacity: .3; } .hardware-caption, .hardware-tag { display: none; }
    .menu-zone { margin-top: 50px; width: 94%; } .menu-hint { font-size: 8px; } .menu-row { margin-left: calc(var(--i) * 4px); } .menu-name { font-size: clamp(21px, 5.8vw, 36px); } .menu-link { padding: 17px 15px; gap: 9px; } .arrow { font-size: 21px; }
    .detail { position: relative; left: 0; top: 0; margin: 18px 0 15px; width: 100%; transform: rotate(5deg); box-shadow: 5px 5px 0 var(--cyan); }
    .detail::before { display: none; } .biosignal { margin-top: 55px; padding: 14px; } .signal-label { font-size: 8px; letter-spacing: .6px; } .signal-label span:last-child { max-width: 45%; text-align: right; }
    .experiment-footer { align-items: flex-start; flex-direction: column; padding: 25px 7%; } .ghost-type { top: 460px; right: -15px; font-size: 125px; } .stripe-one { clip-path: polygon(100% 0, 100% 72%, 20% 100%, 0 100%); } .stage-footer { font-size: 8px; }
  }
  @media (hover: none) { .menu-hint span:last-child { font-size: 0; } .menu-hint span:last-child::after { content: 'TAP TO EXPLORE ↙'; font-size: 8px; } }
  @media (prefers-reduced-motion: reduce) { .hardware, .menu-link { transition: none; } .gear, .scan-line, .detail { animation: none; } .scan-line { left: 60%; } }
  /* Letter tiles and cut silhouettes bring the menu forward as a graphic layer. */
  .version-bar h1 { padding: 2px 12px; background: white; color: var(--ink); transform: rotate(-4deg); box-shadow: 4px 4px 0 var(--blue); }
  .name-stamp { display: block; width: fit-content; margin-top: 16px; padding: 7px 13px; background: white; color: var(--ink); font: 700 10px 'Courier New', monospace; letter-spacing: 1.5px; transform: rotate(2deg); }
  .halftone { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(#001d5e70 1.2px, transparent 1.5px) 0 0 / 10px 10px; mask-image: linear-gradient(110deg, transparent 30%, black 80%); }
  .ink-cut { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: var(--ink); clip-path: polygon(85% 0, 100% 0, 100% 100%, 70% 100%, 77% 76%, 70% 73%, 86% 32%, 78% 28%); }
  .hardware { filter: drop-shadow(-8px 6px 0 #53eeff44); }
  .ghost-type { -webkit-text-stroke-color: #ffffff66; }
  .selector { gap: 11px; }
  .menu-row { animation: menu-arrive 460ms cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--i) * 65ms); }
  .menu-link { background: transparent; position: relative; isolation: isolate; padding-top: 13px; padding-bottom: 13px; }
  .menu-link::before { content: ''; position: absolute; z-index: -1; inset: -2px -9px -2px -10px; background: var(--ink); clip-path: polygon(2% 15%, 25% 6%, 28% 0, 98% 7%, 100% 82%, 67% 94%, 65% 100%, 0 91%); transition: background 170ms, transform 170ms; }
  .menu-name { display: flex; align-items: baseline; font-family: 'Arial Black', Impact, Arial, sans-serif; line-height: 1.08; letter-spacing: -.04em; }
  .letter { display: inline-block; position: relative; transform: translateY(var(--rise)) rotate(var(--tilt)); text-shadow: 2px 3px 0 var(--ink); transition: transform 150ms, color 150ms, background 150ms; }
  .letter.tile { color: var(--ink); background: white; text-shadow: none; padding: 0 .055em; margin: 0 .025em; box-shadow: 2px 2px 0 var(--blue); }
  .letter.accent { color: var(--cyan); }
  .letter.space { width: .24em; }
  .index { color: var(--cyan); padding-bottom: 1px; }
  .arrow { opacity: 0; color: var(--ink); background: var(--cyan); font-size: 20px; padding: 2px 5px; transition: opacity 150ms; }
  .menu-row.is-selected > .menu-link, .menu-row.is-selected > .menu-link { background: transparent; box-shadow: none; }
  .menu-row.is-selected > .menu-link::before, .menu-row.is-selected > .menu-link::before { background: white; transform: scaleY(1.12); }
  .menu-row.is-selected .letter, .menu-row.is-selected .letter { color: var(--ink); text-shadow: none; animation: letter-lift 280ms ease-out both; animation-delay: calc(var(--letter-order) * 9ms); }
  .menu-row.is-selected .letter.tile, .menu-row.is-selected .letter.tile { color: white; background: var(--ink); box-shadow: 2px 2px 0 var(--cyan); }
  .menu-row.is-selected .letter.accent, .menu-row.is-selected .letter.accent { background: var(--cyan); color: var(--ink); }
  .menu-row.is-selected .index, .menu-row.is-selected .index { color: var(--blue); }
  .menu-row.is-selected .arrow, .menu-row.is-selected .arrow { opacity: 1; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) > .menu-link { background: transparent; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) > .menu-link::before { background: var(--ink); transform: none; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) .letter { color: white; text-shadow: 2px 3px 0 var(--ink); animation: none; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) .letter.tile { color: var(--ink); background: white; text-shadow: none; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) .letter.accent { color: var(--cyan); background: transparent; }
  .selector:has(.menu-row.is-selected) .menu-row:not(.is-selected) .arrow { opacity: 0; }
  .detail { background: transparent; box-shadow: none; isolation: isolate; filter: drop-shadow(7px 7px 0 var(--cyan)); }
  .detail::after { content: ''; position: absolute; z-index: -1; inset: 0; background: var(--ink); clip-path: polygon(0 5%, 5% 0, 100% 0, 100% 92%, 94% 100%, 0 100%); }
  .detail h3 { font-family: 'Arial Black', Impact, Arial, sans-serif; font-size: 27px; text-transform: uppercase; line-height: 1.05; }
  .control-hints { display: flex; align-items: center; gap: 10px; }
  kbd { background: white; color: var(--ink); padding: 3px 6px; font-family: inherit; font-size: 9px; transform: skew(-8deg); }
  @keyframes menu-arrive { from { opacity: 0; translate: -25px 8px; } to { opacity: 1; translate: 0 0; } }
  @keyframes letter-lift { 0%, 100% { transform: translateY(var(--rise)) rotate(var(--tilt)); } 45% { transform: translateY(calc(var(--rise) - 4px)) rotate(0); } }
  @media (max-width: 900px) { .menu-name { font-size: clamp(20px, 2.6vw, 30px); } }
  @media (max-width: 700px) { .menu-name { font-size: clamp(20px, 5.15vw, 33px); } .menu-link { gap: 8px; } .index { font-size: 10px; } .arrow { font-size: 14px; padding: 2px 3px; } .name-stamp { font-size: 9px; letter-spacing: .7px; } .ink-cut { clip-path: polygon(100% 0, 100% 100%, 80% 100%, 91% 55%, 81% 52%); } }
  @media (prefers-reduced-motion: reduce) { .menu-row, .menu-row.is-selected .letter, .menu-row.is-selected .letter { animation: none; } .letter, .arrow, .menu-link::before { transition: none; } }
  .experiment { scroll-margin-top: 60px; }
  .experiment:focus { outline: none; }
  button.menu-link { border: 0; cursor: pointer; font-family: inherit; }
  .menu-link:focus-visible, button:focus-visible { outline: 3px solid #ffdd45; outline-offset: 6px; }
  .human-arm > path:first-child { fill: #eafaff; stroke: #061735; stroke-width: 5; }
  .human-arm .muscle { fill: none; stroke: #0754fa; stroke-width: 2; }
  .human-arm .bio-wire { fill: none; stroke: #53eeff; stroke-width: 3; stroke-dasharray: 7 5; }
  .human-arm .electrode { fill: #061735; stroke: #53eeff; stroke-width: 3; }
  .human-arm text { fill: white; font: 10px 'Courier New', monospace; letter-spacing: 1px; }
  .in-section { min-height: 100vh; padding-top: 38px; }
  .in-section .ghost-type { opacity: .2; }
  .section-shell { position: relative; z-index: 4; display: grid; grid-template-columns: 215px minmax(0, 1fr); gap: 42px; align-items: start; }
  .screen-sidebar { position: sticky; top: 90px; display: grid; gap: 12px; }
  .screen-sidebar button { display: flex; align-items: center; gap: 8px; border: 0; padding: 14px 12px; color: white; background: var(--ink); font: 900 14px Arial, sans-serif; cursor: pointer; text-align: left; transform: skewX(-5deg); box-shadow: 4px 4px 0 #002a8c; }
  .screen-sidebar button > span:first-child { font: 10px 'Courier New', monospace; color: var(--cyan); }
  .screen-sidebar button > span:last-child { margin-left: auto; }
  .screen-sidebar button.current, .screen-sidebar button:hover { background: white; color: var(--ink); box-shadow: 4px 4px 0 var(--cyan); }
  .screen-sidebar button.current > span:first-child { color: var(--blue); }
  .screen-sidebar .back-button { margin-bottom: 16px; color: var(--cyan); border: 1px solid #53eeff88; font-size: 11px; }
  .back-button kbd { margin-left: auto; }
  .sidebar-signal { margin-top: 28px; color: var(--cyan); font: 10px 'Courier New', monospace; letter-spacing: 2px; }
  .sidebar-signal svg { width: 100%; height: 55px; fill: none; stroke: var(--cyan); stroke-width: 2; background: var(--ink); }
  .sidebar-signal span { display: block; padding-top: 12px; }
  .section-heading { background: #061735e8; padding: 26px 30px; border-left: 6px solid var(--cyan); box-shadow: 8px 8px 0 #53eeff66; }
  .section-heading > span { color: var(--cyan); font: 700 10px 'Courier New', monospace; letter-spacing: 2px; }
  .section-heading h2 { font-size: clamp(34px, 4.8vw, 65px); margin: 15px 0; transform: none; letter-spacing: -.055em; }
  .section-heading h2:focus { outline: none; }
  .section-heading p { margin: 0; color: #bcd7ef; font-size: 14px; line-height: 1.6; }
  .section-tabs { display: flex; flex-wrap: wrap; gap: 12px; margin: 30px 0; }
  .section-tabs a { background: var(--ink); color: white; padding: 10px 16px; text-decoration: none; font-weight: 700; font-size: 12px; box-shadow: 3px 3px 0 #002a8c; }
  .section-tabs .tab-active, .section-tabs a:hover { color: var(--ink); background: var(--cyan); }
  .content-wrapper { margin-top: 30px; animation: content-enter 250ms ease-out; }
  @keyframes content-enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 1000px) { .section-shell { grid-template-columns: 160px minmax(0, 1fr); gap: 24px; } .screen-sidebar button { font-size: 12px; } }
  @media (max-width: 700px) { .section-shell { grid-template-columns: 1fr; gap: 24px; } .screen-sidebar { position: static; display: flex; overflow-x: auto; padding: 5px 5px 10px; } .screen-sidebar button { flex-shrink: 0; white-space: nowrap; } .screen-sidebar .back-button { margin-bottom: 0; } .sidebar-signal { display: none; } .section-heading { padding: 20px; } .section-heading h2 { font-size: 36px; } .control-hints { gap: 5px; font-size: 8px; } }
  @media (prefers-reduced-motion: reduce) { .content-wrapper { animation: none; } }
</style>
