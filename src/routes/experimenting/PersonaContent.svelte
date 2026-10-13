<script lang="ts">
  import WorkExperiencePage from '../work-experience/WorkExperiencePage.svelte';
  import PublicationsPage from '../publications/PublicationsPage.svelte';
  import ProjectsPage from '../projects/+page.svelte';
  import AboutMePage from '../about-me/+page.svelte';
  import OtherProjectsPage from '../other-projects/OtherProjectsPage.svelte';
  const projectTitles: Record<string, string> = { verdigris: 'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture', driving: 'Rehabilitative Driving Simulator', dinobot: 'Social DinoBot' };

  export let section: string;
  export let panel: string;
  export let item = '';
</script>

<div class="persona-content">
  {#if section === 'research'}
    {#if panel === 'projects'}
      <ProjectsPage mode="research" />
    {:else if panel === 'publications'}
      <PublicationsPage />
    {:else}
      <WorkExperiencePage kind="research" />
    {/if}
  {:else if section === 'work'}
    <WorkExperiencePage kind="work" organization={panel === 'maingen' ? 'Maingen' : 'Tadashi'} />
    {#if panel === 'tadashi'}
      <ProjectsPage mode="work" focusTitle="Ember Social Robotics Platform" />
    {/if}
  {:else if section === 'other'}
    {#if panel === 'additional'}
      <OtherProjectsPage />
    {:else}
      <ProjectsPage mode="other" focusTitle={projectTitles[panel] ?? ''} />
    {/if}
  {:else if section === 'cv'}
    <div class="cv-actions"><span>THE RECORD / NATHANIEL KIM</span><a href="/CV.pdf" target="_blank" rel="noreferrer">Open PDF ↗</a><a href="/CV.pdf" download>Download CV ↓</a></div>
    <iframe src="/CV.pdf" title="Nathaniel Kim's CV"></iframe>
  {:else if section === 'beyond'}
    <AboutMePage focusCategory={panel} focusPet={item} />
  {/if}
</div>

<style>
  .persona-content { min-width: 0; color: #edf5ff; line-height: 1.65; }
  .persona-content :global(.experience-page), .persona-content :global(.publications-page), .persona-content :global(.portfolio-wrapper), .persona-content :global(.other-projects-page), .persona-content :global(.personal-header), .persona-content :global(.personal-category) { max-width: none; margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0; background: transparent; }
  .persona-content :global(h1), .persona-content :global(h2), .persona-content :global(h3) { color: white; font-family: 'Arial Black', Impact, Arial, sans-serif; letter-spacing: -.035em; line-height: 1.12; }
  .persona-content :global(h1), .persona-content :global(.portfolio-header h2) { font-size: clamp(30px, 4vw, 52px); text-transform: uppercase; }
  .persona-content :global(.project-header) { font-size: clamp(21px, 2.3vw, 30px); }
  .persona-content :global(article), .persona-content :global(.project-row), .persona-content :global(.personal-category) { padding: 26px; border: 1px solid #53eeff55; border-left: 4px solid #53eeff; background: #041431dd; box-shadow: 6px 6px 0 #00379a88; }
  .persona-content :global(.project-row.odd) { flex-direction: row; }
  .persona-content :global(.eyebrow), .persona-content :global(.role), .persona-content :global(.project-meta), .persona-content :global(.date-location), .persona-content :global(.status), .persona-content :global(.interest-number), .persona-content :global(.authors), .persona-content :global(.equal-note), .persona-content :global(.caption-list), .persona-content :global(figcaption), .persona-content :global(.description), .persona-content :global(.personal-header p), .persona-content :global(h3 span) { color: #bcd7ef; }
  .persona-content :global(.eyebrow) { color: #53eeff; font-family: 'Courier New', monospace; }
  .persona-content :global(a) { color: #53eeff; }
  .persona-content :global(.project-link), .persona-content :global(.expand-button), .persona-content :global(.future-card) { background: #073877; color: #edf5ff; border: 1px solid #53eeff66; border-radius: 0; }
  .persona-content :global(.media-notice) { color: #bcd7ef; border-color: #53eeff55; background: #05254a; border-radius: 0; }
  .persona-content :global(.card) { background: #061735; color: white; border-radius: 0; }
  .persona-content :global(.personal-category) { margin-top: 25px; }
  .persona-content :global(.personal-header) { padding-top: 0; }
  .persona-content :global(.organization-line) { flex-wrap: wrap; }
  .persona-content :global(.employer-logo) { background: white; padding: 5px; }
  .persona-content :global(button:focus-visible), .persona-content :global(a:focus-visible) { outline: 3px solid #ffdd45; outline-offset: 4px; }
  .cv-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-bottom: 24px; font: 700 11px 'Courier New', monospace; }
  .cv-actions span { margin-right: auto; color: #53eeff; }
  .cv-actions a { display: inline-block; background: white; color: #061735; padding: 12px 18px; text-decoration: none; font: 700 13px Arial, sans-serif; box-shadow: 4px 4px 0 #53eeff; }
  iframe { width: 100%; height: 78vh; min-height: 550px; border: 1px solid #53eeff; background: white; }
  @media (max-width: 1000px) { .persona-content :global(.project-row), .persona-content :global(.project-row.odd) { flex-direction: column; align-items: stretch; } }
  @media (max-width: 600px) { .persona-content :global(article), .persona-content :global(.project-row), .persona-content :global(.personal-category) { padding: 18px; } }
</style>
