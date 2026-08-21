<script lang="ts">
  import { onMount } from 'svelte';
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

  function scrollToSection(sectionId: string) {
    if ($page.url.pathname === '/about-me') {
      window.location.href = `/home#${sectionId}`;
      return;
    }

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
    updateActiveSection();

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
</nav>

<main>
  {#if $page.url.pathname === '/about-me'}
    <section id="about-me">
      <AboutMePage />
    </section>
  {:else}
    <section id="home">
      <HomePage />
    </section>

    <section id="research-experience" class="major-section">
      <WorkExperiencePage kind="research" />
    </section>

    <section id="publications">
      <PublicationsPage />
    </section>

    <section id="research-projects">
      <ProjectsPage mode="research" />
    </section>

    <section id="work-experience" class="major-section">
      <WorkExperiencePage kind="work" />
    </section>

    <section id="work-projects">
      <ProjectsPage mode="work" />
    </section>

    <section id="other-projects" class="major-section">
      <ProjectsPage mode="other" />
    </section>

    <section id="cv">
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
    margin-top: 1.5rem;
  }

  main > section.major-section {
    margin-top: 5rem;
  }

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
  }
</style>
