<script lang="ts">
  const experiences = [
    {
      organization: 'GRASP Laboratory, University of Pennsylvania',
      role: 'Graduate Research Assistant → Research Engineer',
      dates: 'Aug 2023 – Present',
      location: 'Philadelphia, PA',
      description: 'Develop musculoskeletal digital twins, real-time control and signal-processing systems, and machine-learning methods for upper-limb exoskeletons and high-density EMG-based movement and injury analysis.',
      projectId: 'project-exoskeleton'
    },
    {
      organization: 'Maingen (Y Combinator)',
      role: 'Research Resident',
      dates: 'Jul 2026 – Present',
      location: 'Remote',
      description: 'Research machine-learning methods for generating robotic end-effector CAD geometries and build simulation and evaluation pipelines that test geometric validity, mechanical performance, and task-specific engineering constraints.'
    },
    {
      organization: 'Tadashi Robotics',
      role: 'Founding Mechanical Engineer',
      dates: 'Aug 2025 – Present',
      location: 'Philadelphia, PA',
      description: 'Translate the Ember social-robotics research platform into an early-stage rehabilitation product by developing its mechanical enclosure, embedded architecture, sensing and communication hardware, and LLM-based patient interactions.',
      projectId: 'project-ember'
    }
  ];
</script>

<div class="experience-page">
  <header>
    <p class="eyebrow">Background</p>
    <h1>Work Experience</h1>
  </header>

  <div class="experience-list">
    {#each experiences as experience}
      <article>
        <div class="experience-heading">
          <div>
            <h2>{experience.organization}</h2>
            <p class="role">{experience.role}</p>
          </div>
          <p class="date-location">{experience.dates}<br />{experience.location}</p>
        </div>

        <p class="description">{experience.description}</p>

        {#if experience.projectId}
          <a class="project-link" href={`#${experience.projectId}`}>Click here to view the related project</a>
        {/if}
      </article>
    {/each}
  </div>
</div>

<style>
  .experience-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
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

  .project-link {
    display: inline-block;
    margin-top: 0.85rem;
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.2em;
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
