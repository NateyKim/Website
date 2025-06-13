<script>
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // Get current path
  const currentPath = derived(page, $page => $page.url.pathname);

  // Tabs with paths and labels
  const tabs = [
    { label: 'About Me', path: '/about-me' },
    { label: 'Projects', path: '/projects' },
    { label: 'Hobbies', path: '/hobbies' },
    { label: 'Resume', path: '/resume' }
  ];
</script>

<style>
  nav {
    background-color: #333;
    color: white;
    display: flex;
    padding: 0.5rem 1rem;
  }
  a {
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    cursor: pointer;
  }
  a.active {
    border-bottom: 2px solid #fff;
    font-weight: bold;
  }
  a:hover {
    background-color: #444;
  }
  main {
    padding: 1rem;
  }
</style>

<nav>
  {#each tabs as tab}
    <a
      href="{tab.path}"
      class:active={$currentPath === tab.path}
      >{tab.label}</a
    >
  {/each}
</nav>

<main>
  <slot />
</main>
