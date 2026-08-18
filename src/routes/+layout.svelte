<script lang="ts">
  import { onMount } from 'svelte';

  import HomePage from './home/+page.svelte';
  import ProjectsPage from './projects/+page.svelte';
  import AboutMePage from './about-me/+page.svelte';
  import HobbiesPage from './hobbies/+page.svelte';
  import CVPage from './cv/+page.svelte';
  import OtherProjectsPage from './other-projects/OtherProjectsPage.svelte';

  let activeSection = 'home';

  const sections = [
    { label: 'Home', id: 'home' },
    { label: 'Projects', id: 'projects' },
    { label: 'About Me', id: 'about-me' },
    { label: 'Hobbies', id: 'hobbies' },
    { label: 'CV', id: 'cv' }
  ];

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function updateActiveSection() {
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
  {#each sections as section}
    {#if section.id === 'projects'}
      <div class="nav-item">
        <button
          class="nav-link"
          class:active={activeSection === section.id}
          on:click={() => scrollToSection(section.id)}
          aria-haspopup="true"
        >
          {section.label}
        </button>
        <div class="project-menu" aria-label="Other projects">
          <button type="button" on:click={() => scrollToSection('projects')}>Main Projects</button>
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
  <section id="home">
    <HomePage />
  </section>

  <section id="projects">
    <ProjectsPage />
  </section>

  <section id="about-me">
    <AboutMePage />
  </section>

  <section id="hobbies">
    <HobbiesPage />
  </section>

  <section id="cv">
    <CVPage />
  </section>

  <section id="other-projects">
    <OtherProjectsPage />
  </section>
</main>

<style>
  nav {
    background-color: #333;
    color: white;
    display: flex;
    padding: 0.5rem 1rem;
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
</style>
