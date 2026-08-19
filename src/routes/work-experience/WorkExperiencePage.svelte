<script lang="ts">
  const experiences = [
    {
      organization: 'GRASP Laboratory, University of Pennsylvania',
      logo: 'P',
      logoClass: 'penn-logo',
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
      organization: 'Maingen (Y Combinator)',
      logo: 'M',
      logoClass: 'maingen-logo',
      role: 'Research Resident',
      dates: 'Jul 2026 – Present',
      location: 'Remote',
      description: 'Research machine-learning methods for generating robotic end-effector CAD geometries and build simulation and evaluation pipelines that test geometric validity, mechanical performance, and task-specific engineering constraints. My benchtop project develops an autonomous pipeline that compiles generated parametric designs into physically grounded MuJoCo simulations and iteratively repairs them using deterministic mechanical, collision, and robustness checks.'
    },
    {
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
            <div class="organization-line">
              {#if experience.logo && experience.logoClass}
                <span class="employer-logo {experience.logoClass}" aria-hidden="true">{experience.logo}</span>
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

  .organization-line {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .employer-logo {
    display: grid;
    width: 2.6rem;
    height: 2.6rem;
    flex: 0 0 2.6rem;
    place-items: center;
    border-radius: 0.65rem;
    color: white;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  .penn-logo {
    background: #011f5b;
    box-shadow: inset 0 -0.32rem 0 #990000;
  }

  .maingen-logo {
    background: #111;
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
