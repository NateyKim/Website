<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';

  import HomePage from './home/+page.svelte';
  import WorkExperiencePage from './work-experience/WorkExperiencePage.svelte';
  import PublicationsPage from './publications/PublicationsPage.svelte';
  import ProjectsPage from './projects/+page.svelte';
  import AboutMePage from './about-me/+page.svelte';
  import CVPage from './cv/+page.svelte';

  let activeSection = 'home';

  const sections = [
    { label: 'Home', id: 'home' },
    { label: 'Research', id: 'research-experience' },
    { label: 'Publications', id: 'publications' },
    { label: 'Research Projects', id: 'research-projects' },
    { label: 'Work', id: 'work-experience' },
    { label: 'Work Projects', id: 'work-projects' },
    { label: 'Other Projects', id: 'other-projects' },
    { label: 'CV', id: 'cv' },
    { label: 'Beyond the Work', id: 'about-me' }
  ];

  function isActive(sectionIds: string[]) {
    return sectionIds.includes(activeSection);
  }

  async function scrollToSection(sectionId: string) {
    if ($page.url.pathname === '/about-me') {
      window.location.href = `/home#${sectionId}`;
      return;
    }

    activeSection = sectionId;
    await tick();
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function updateActiveSection() {
    if ($page.url.pathname === '/about-me') {
      activeSection = 'about-me';
      return;
    }

    if (window.matchMedia('(max-width: 700px)').matches) {
      return;
    }

    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i].id);

      if (section && section.offsetTop <= scrollPosition) {
        activeSection = sections[i].id;
        break;
      }
    }
  }

  onMount(() => {
    window.addEventListener('scroll', updateActiveSection);
    const linkedSection = window.location.hash.slice(1);

    if (sections.some((section) => section.id === linkedSection)) {
      activeSection = linkedSection;
    } else {
      updateActiveSection();
    }

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  });
</script>

<nav>
  <button class="nav-link" class:active={activeSection === 'home'} on:click={() => scrollToSection('home')}>
    Home
  </button>

  <div class="nav-item">
    <button
      class="nav-link"
      class:active={isActive(['research-experience', 'publications', 'research-projects'])}
      on:click={() => scrollToSection('research-experience')}
      aria-haspopup="true"
    >
      Research
    </button>
    <div class="nav-menu" aria-label="Research navigation">
      <button type="button" on:click={() => scrollToSection('research-experience')}>Experience</button>
      <button type="button" on:click={() => scrollToSection('publications')}>Publications</button>
      <button type="button" on:click={() => scrollToSection('research-projects')}>Projects</button>
    </div>
  </div>

  <div class="nav-item">
    <button
      class="nav-link"
      class:active={isActive(['work-experience', 'work-projects'])}
      on:click={() => scrollToSection('work-experience')}
      aria-haspopup="true"
    >
      Work
    </button>
    <div class="nav-menu" aria-label="Work navigation">
      <button type="button" on:click={() => scrollToSection('work-experience')}>Experience</button>
      <button type="button" on:click={() => scrollToSection('work-projects')}>Projects</button>
    </div>
  </div>

  <button
    class="nav-link"
    class:active={activeSection === 'other-projects'}
    on:click={() => scrollToSection('other-projects')}
  >
    Other Projects
  </button>

  <button class="nav-link" class:active={activeSection === 'cv'} on:click={() => scrollToSection('cv')}>
    CV
  </button>

  <a class="nav-link" class:active={activeSection === 'about-me'} href="/about-me">
    Beyond the Work
  </a>

  <a
    class="nav-link linkedin-nav"
    href="https://www.linkedin.com/in/nateykim"
    target="_blank"
    rel="noreferrer"
    aria-label="Visit Natey Kim’s LinkedIn profile"
    title="LinkedIn"
  >
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  </a>
</nav>

<main>
  {#if $page.url.pathname === '/about-me'}
    <section id="about-me">
      <AboutMePage />
    </section>
  {:else}
    <section id="home" class="mobile-subject" class:mobile-active={activeSection === 'home'}>
      <HomePage />
    </section>

    <section id="research-experience" class="major-section mobile-subject" class:mobile-active={isActive(['research-experience', 'publications', 'research-projects'])}>
      <div class="research-network" aria-hidden="true">
        <svg viewBox="0 0 1200 900" preserveAspectRatio="none">
          <g class="research-network-lines">
            <path d="M0 120 L120 62 L242 142 L370 74 L498 158 L620 58 L748 148 L874 82 L1004 154 L1128 68 L1200 112" />
            <path d="M0 286 L98 218 L226 304 L350 206 L480 296 L604 194 L734 292 L860 210 L990 306 L1114 214 L1200 278" />
            <path d="M0 472 L126 382 L252 478 L378 368 L506 466 L634 354 L762 470 L890 374 L1018 482 L1142 388 L1200 438" />
            <path d="M0 656 L106 566 L234 668 L362 548 L492 658 L620 536 L750 664 L878 554 L1008 674 L1136 572 L1200 626" />
            <path d="M120 62 L98 218 L126 382 L106 566 M242 142 L226 304 L252 478 L234 668 M370 74 L350 206 L378 368 L362 548 M498 158 L480 296 L506 466 L492 658 M620 58 L604 194 L634 354 L620 536 M748 148 L734 292 L762 470 L750 664 M874 82 L860 210 L890 374 L878 554 M1004 154 L990 306 L1018 482 L1008 674 M1128 68 L1114 214 L1142 388 L1136 572" />
            <path d="M120 62 L226 304 M242 142 L350 206 M370 74 L480 296 M498 158 L604 194 M620 58 L734 292 M748 148 L860 210 M874 82 L990 306 M1004 154 L1114 214 M98 218 L252 478 M226 304 L378 368 M350 206 L506 466 M480 296 L634 354 M604 194 L762 470 M734 292 L890 374 M860 210 L1018 482 M990 306 L1142 388" />
          </g>
          <g class="research-network-nodes">
            {#each [[120,62],[242,142],[370,74],[498,158],[620,58],[748,148],[874,82],[1004,154],[1128,68],[98,218],[226,304],[350,206],[480,296],[604,194],[734,292],[860,210],[990,306],[1114,214],[126,382],[252,478],[378,368],[506,466],[634,354],[762,470],[890,374],[1018,482],[1142,388],[106,566],[234,668],[362,548],[492,658],[620,536],[750,664],[878,554],[1008,674],[1136,572]] as node}
              <circle cx={node[0]} cy={node[1]} r="5" />
            {/each}
          </g>
        </svg>
      </div>
      <WorkExperiencePage kind="research" />
    </section>

    <section id="publications" class="mobile-subject" class:mobile-active={isActive(['research-experience', 'publications', 'research-projects'])}>
      <PublicationsPage />
    </section>

    <section id="research-projects" class="mobile-subject" class:mobile-active={isActive(['research-experience', 'publications', 'research-projects'])}>
      <ProjectsPage mode="research" />
    </section>

    <section id="work-experience" class="major-section mobile-subject" class:mobile-active={isActive(['work-experience', 'work-projects'])}>
      <WorkExperiencePage kind="work" />
    </section>

    <section id="work-projects" class="mobile-subject" class:mobile-active={isActive(['work-experience', 'work-projects'])}>
      <ProjectsPage mode="work" />
    </section>

    <section id="other-projects" class="major-section mobile-subject" class:mobile-active={activeSection === 'other-projects'}>
      <ProjectsPage mode="other" />
    </section>

    <section id="cv" class="major-section mobile-subject" class:mobile-active={activeSection === 'cv'}>
      <CVPage />
      <div class="beyond-cta">
        <p>Curious to see who I am beyond the work?</p>
        <a href="/about-me">Explore Beyond the Work</a>
      </div>
    </section>
  {/if}
</main>

<style>
  nav {
    background-color: #333;
    color: white;
    display: flex;
    padding: calc(0.5rem + env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) 0.5rem max(1rem, env(safe-area-inset-left));
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-link {
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .nav-link.active {
    border-bottom: 2px solid #fff;
    font-weight: bold;
  }

  .nav-link:hover {
    background-color: #444;
  }

  .linkedin-nav {
    align-items: center;
    display: inline-flex;
    margin-left: auto;
  }

  .linkedin-nav svg {
    width: 1.35rem;
    height: 1.35rem;
    fill: currentColor;
  }

  .nav-item {
    position: relative;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    width: min(24rem, 90vw);
    padding: 0.4rem;
    border-radius: 0 0 0.5rem 0.5rem;
    background: #333;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }

  .nav-item:hover .nav-menu,
  .nav-item:focus-within .nav-menu {
    display: grid;
  }

  .nav-menu button {
    display: block;
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 0;
    border-radius: 0.3rem;
    background: transparent;
    color: white;
    cursor: pointer;
    font-size: 0.92rem;
    text-align: left;
    text-decoration: none;
  }

  .nav-menu button:hover,
  .nav-menu button:focus-visible {
    background: #555;
  }

  main {
    margin-top: 60px;
  }

  section {
    scroll-margin-top: 60px;
  }

  section#home,
  section#cv,
  section#about-me {
    min-height: 100vh;
  }

  main > section + section {
    margin-top: 8rem;
  }

  main > section.major-section {
    margin-top: clamp(24rem, 45vh, 38rem);
  }

  #research-experience {
    position: relative;
    isolation: isolate;
  }

  #research-experience::before {
    position: absolute;
    z-index: -1;
    top: clamp(-38rem, -45vh, -24rem);
    left: 50%;
    width: 100vw;
    height: calc(clamp(24rem, 45vh, 38rem) + 14rem);
    background: linear-gradient(to bottom, rgba(242, 245, 252, 0.72), rgba(248, 250, 252, 0.34) 62%, transparent);
    content: '';
    mask-image: linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.82) 48%, transparent 100%);
    pointer-events: none;
    transform: translateX(-50%);
  }

  .research-network {
    position: absolute;
    z-index: -1;
    top: calc(clamp(-38rem, -45vh, -24rem) - 8rem);
    left: 50%;
    width: 100vw;
    height: calc(clamp(24rem, 45vh, 38rem) + 54rem);
    pointer-events: none;
    transform: translateX(-50%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 56%, transparent 100%);
  }

  .research-network svg { width: 100%; height: 100%; }
  .research-network-lines path { fill: none; stroke: #73829a; stroke-width: 1.15; opacity: 0.24; vector-effect: non-scaling-stroke; }
  .research-network-nodes circle { fill: #7566ff; stroke: rgba(248, 250, 252, 0.9); stroke-width: 2.5; opacity: 0.42; vector-effect: non-scaling-stroke; }

  .beyond-cta {
    padding: 2.5rem 1rem 3.5rem;
    background: #f5f5f5;
    text-align: center;
  }

  .beyond-cta p {
    margin: 0 0 1rem;
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 700;
  }

  .beyond-cta a {
    display: inline-block;
    padding: 0.8rem 1.2rem;
    border-radius: 0.5rem;
    background: #333;
    color: white;
    font-weight: 700;
    text-decoration: none;
  }

  .beyond-cta a:hover,
  .beyond-cta a:focus-visible {
    background: #555;
  }

  :global(html) {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }

  @media (max-width: 700px) {
    nav {
      gap: 0.1rem;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }

    nav::-webkit-scrollbar {
      display: none;
    }

    .nav-link,
    .nav-item {
      flex: 0 0 auto;
    }

    .linkedin-nav {
      margin-left: 0;
    }

    .nav-link {
      padding-right: 0.7rem;
      padding-left: 0.7rem;
      white-space: nowrap;
    }

    main {
      margin-top: calc(60px + env(safe-area-inset-top));
    }

    section {
      scroll-margin-top: calc(60px + env(safe-area-inset-top));
    }

    main > section.major-section {
      margin-top: 0;
    }

    #research-experience::before {
      display: none;
    }

    main > section + section {
      margin-top: 8rem;
    }

    .mobile-subject:not(.mobile-active) {
      display: none;
    }
  }
</style>
