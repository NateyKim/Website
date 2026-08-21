<script lang="ts">
  export let kind: 'research' | 'work' = 'work';

  const allExperiences = [
    {
      kind: 'research',
      organization: 'GRASP Laboratory, University of Pennsylvania',
      logoSrc: '/employer-logos/grasp.webp',
      logoAlt: 'Penn Engineering GRASP Laboratory logo',
      role: 'Graduate Research Assistant → Research Engineer',
      dates: 'Aug 2023 – Present',
      location: 'Philadelphia, PA',
      description: 'Develop musculoskeletal digital twins, real-time control and signal-processing systems, and machine-learning methods for upper-limb exoskeletons. I also develop high-density surface EMG hardware and analysis pipelines for movement assessment, rehabilitation-exercise classification, and Achilles tendinopathy detection.',
      projectLinks: [
        { label: 'Upper-limb exoskeleton project', id: 'project-exoskeleton' },
        { label: 'HD-sEMG and Achilles classification project', id: 'project-achilles' }
      ]
    },
    {
      kind: 'work',
      organization: 'Maingen (Y Combinator)',
      logoSrc: '/employer-logos/maingen.png',
      logoAlt: 'Maingen logo',
      role: 'Research Resident',
      dates: 'Jul 2026 – Present',
      location: 'Remote',
      description: 'Research machine-learning methods for generating robotic end-effector CAD geometries and build simulation and evaluation pipelines that test geometric validity, mechanical performance, and task-specific engineering constraints. My benchtop project develops an autonomous pipeline that compiles generated parametric designs into physically grounded MuJoCo simulations and iteratively repairs them using deterministic mechanical, collision, and robustness checks.'
    },
    {
      kind: 'work',
      organization: 'Tadashi Robotics',
      role: 'Founding Mechanical Engineer',
      dates: 'Aug 2025 – Present',
      location: 'Philadelphia, PA',
      description: 'Serve as the sole engineer developing Ember as the social-robotics research platform moves into an early-stage rehabilitation startup. I lead the evolving mechanical design, embedded architecture, sensing and communication hardware, system integration, prototyping, and LLM-based patient interactions.',
      projectLinks: [
        { label: 'Ember social robotics project', id: 'project-ember' }
      ]
    }
  ];

  $: experiences = allExperiences.filter((experience) => experience.kind === kind);
</script>

<div class="experience-page">
  <header>
    <p class="eyebrow">Background</p>
    <h1>{kind === 'research' ? 'Research Experience' : 'Work Experience'}</h1>
  </header>

  <div class="experience-list">
    {#each experiences as experience}
      <article>
        <div class="experience-heading">
          <div>
            <div class="organization-line">
              {#if experience.logoSrc && experience.logoAlt}
                <img class="employer-logo" src={experience.logoSrc} alt={experience.logoAlt} />
              {/if}
              <h2>{experience.organization}</h2>
            </div>
            <p class="role">{experience.role}</p>
          </div>
          <p class="date-location">{experience.dates}<br />{experience.location}</p>
        </div>

        <p class="description">{experience.description}</p>

        {#if experience.projectLinks}
          <div class="project-links" aria-label={`Projects related to ${experience.organization}`}>
            {#each experience.projectLinks as projectLink}
              <a class="project-link" href={`#${projectLink.id}`}>{projectLink.label} <span aria-hidden="true">→</span></a>
            {/each}
          </div>
        {/if}
      </article>
    {/each}
  </div>
</div>

<style>
  .experience-page {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0;
  }

  header {
    margin-bottom: 2.5rem;
  }

  .eyebrow {
    margin: 0 0 0.35rem;
    color: #666;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4rem);
  }

  .experience-list {
    border-top: 1px solid #c9c9c9;
  }

  article {
    padding: 2rem 0;
    border-bottom: 1px solid #c9c9c9;
  }

  .experience-heading {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  }

  h2 {
    margin: 0;
    font-size: 1.4rem;
  }

  .organization-line {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .employer-logo {
    width: 4.5rem;
    height: 3.2rem;
    flex: 0 0 4.5rem;
    border-radius: 0.45rem;
    object-fit: contain;
  }

  .role,
  .date-location,
  .description {
    line-height: 1.6;
  }

  .role {
    margin: 0.25rem 0 0;
    font-weight: 600;
  }

  .date-location {
    flex-shrink: 0;
    margin: 0;
    color: #666;
    text-align: right;
  }

  .description {
    max-width: 760px;
    margin: 1rem 0 0;
  }

  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin-top: 0.9rem;
  }

  .project-link {
    display: inline-block;
    color: #0759c7;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 0.1em;
    text-underline-offset: 0.22em;
  }

  .project-link:hover,
  .project-link:focus-visible {
    color: #003b88;
  }

  @media (max-width: 900px) {
    .experience-page {
      margin-right: 1rem;
      margin-left: 1rem;
    }

  }

  @media (max-width: 650px) {
    .experience-heading {
      flex-direction: column;
      gap: 0.5rem;
    }

    .date-location {
      text-align: left;
    }
  }
</style>
