<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  import HomePage from './home/+page.svelte';
  import WorkExperiencePage from './work-experience/WorkExperiencePage.svelte';
  import ProjectsPage from './projects/+page.svelte';
  import AboutMePage from './about-me/+page.svelte';
  import CVPage from './cv/+page.svelte';

  let activeSection = 'home';

  const mainProjectLinks = [
    { label: 'Upper-Limb Exoskeleton', id: 'project-exoskeleton' },
    { label: 'Achilles Classification', id: 'project-achilles' },
    { label: 'Verdigris Ultrasound Guidance', id: 'project-verdigris' },
    { label: 'Ember Social Robotics', id: 'project-ember' },
    { label: 'Rehabilitative Driving Simulator', id: 'project-rehab-driving' },
    { label: 'Social DinoBot', id: 'project-dinobot' }
  ];

  const sections = [
    { label: 'Home', id: 'home' },
    { label: 'Work Experience', id: 'work-experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'CV', id: 'cv' },
    { label: 'Beyond the Work', id: 'about-me' }
  ];

  const navigationSections = sections;

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
  {#each navigationSections as section}
    {#if section.id === 'about-me'}
      <a class="nav-link" class:active={activeSection === section.id} href="/about-me">
        {section.label}
      </a>
    {:else if section.id === 'projects'}
      <div class="nav-item">
        <button
          class="nav-link"
          class:active={activeSection === section.id}
          on:click={() => scrollToSection(section.id)}
          aria-haspopup="true"
        >
          {section.label}
        </button>
        <div class="project-menu" aria-label="Project navigation">
          {#each mainProjectLinks as project}
            <button type="button" on:click={() => scrollToSection(project.id)}>{project.label}</button>
          {/each}
          <button type="button" on:click={() => scrollToSection('other-projects')}>Other Projects</button>
        </div>
      </div>
    {:else}
      <button
        class="nav-link"
        class:active={activeSection === section.id}
        on:click={() => scrollToSection(section.id)}
      >
        {section.label}
      </button>
    {/if}
  {/each}
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

    <section id="work-experience">
      <WorkExperiencePage />
    </section>

    <section id="projects">
      <ProjectsPage />
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

  .project-menu {
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

  .nav-item:hover .project-menu,
  .nav-item:focus-within .project-menu {
    display: grid;
  }

  .project-menu button {
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

  .project-menu button:hover,
  .project-menu button:focus-visible {
    background: #555;
  }

  main {
    margin-top: 60px;
  }

  section {
    min-height: 100vh;
    scroll-margin-top: 60px;
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

    .project-menu {
      display: none !important;
    }

    main {
      margin-top: calc(60px + env(safe-area-inset-top));
    }

    section {
      scroll-margin-top: calc(60px + env(safe-area-inset-top));
    }
  }
</style>
