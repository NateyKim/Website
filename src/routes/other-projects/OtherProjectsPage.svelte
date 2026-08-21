<script lang="ts">
  import { autoplayWhenVisible } from '$lib/autoplayWhenVisible';

  type OtherProject = {
    title: string;
    location: string;
    dates: string;
    description: string;
    media?: string[];
    captions?: string[];
  };

  const projects: OtherProject[] = [
    {
      title: 'Rehabilitative Driving Simulator',
      location: 'Kingston, Jamaica',
      dates: 'Jan 2023 – May 2023',
      description: 'Collaborated with engineers and clinicians in Jamaica to develop a Unity-based driving simulator with custom steering and pedal controls for pediatric patients with hemiplegia.',
      media: [
        '/rehab-driving/patient-first-use.mp4',
        '/rehab-driving/learning-tools.jpg',
        '/rehab-driving/finished-steering-wheel.jpg'
      ],
      captions: [
        'Patient using the device for the first time!',
        'Learning how to use tools',
        'Finished steering wheel setup'
      ]
    },
    {
      title: 'PENN Assistive Devices and Prosthetic Technologies (ADAPT)',
      location: 'Philadelphia, PA',
      dates: 'Jan 2023 – May 2026',
      description: 'Led an undergraduate team designing upper-limb prosthetics with EEG and EMG control. Designed an Arduino- and Raspberry Pi-based prosthetic arm and hand for real-time brain-signal control, and implemented machine-learning models to classify grasping mechanisms.'
    },
    {
      title: 'Cockroach Interface',
      location: 'Philadelphia, PA',
      dates: 'Oct 2024',
      description: 'Created a physical game inspired by Hole in the Wall that controls cockroach movement through EMG signals. Implemented real-time EMG feature extraction and custom hardware filtering.'
    },
    {
      title: 'AI Image to GPS Localization',
      location: 'Philadelphia, PA',
      dates: 'Jan 2025 – May 2025',
      description: 'Developed a deep-learning pipeline to infer geographic locations from a hand-collected image dataset using the Image2GPS algorithm, a ResNet-18 backbone, and custom layers.'
    },
    {
      title: 'PENN Tikkun Olam Makers',
      location: 'Philadelphia, PA',
      dates: 'Aug 2023 – May 2024',
      description: 'Designed a laser-cuttable, adaptable wheelchair for children with physical disabilities and developed assistive toothbrush mechanisms in collaboration with Penn Dental.'
    },
    {
      title: 'KUKA Arm Competition',
      location: 'Philadelphia, PA',
      dates: 'Aug 2023 – Dec 2023',
      description: 'Developed inverse-dynamics and inverse-kinematics control algorithms for a KUKA robotic-arm tower-building competition, including AprilTag-based object recognition and dynamic velocity control.'
    },
    {
      title: 'AI Human Content Generator',
      location: 'Philadelphia, PA',
      dates: 'Aug 2024 – Dec 2024',
      description: 'Created an OpenPose-to-Stable Diffusion machine-learning pipeline for social-media art generation and deployed an upload interface using Gradio.'
    },
    {
      title: 'HVAC Monitoring and Surveillance System',
      location: 'Ithaca, NY',
      dates: 'Mar 2024',
      description: 'Modeled affordable devices for detecting airborne bacteria and fungi through hospital HVAC systems and created a monitoring interface for visualizing the spread of airborne diseases.'
    }
  ];

  let rehabMediaIndex = 0;

  function nextRehabMedia(mediaCount: number) {
    rehabMediaIndex = (rehabMediaIndex + 1) % mediaCount;
  }
</script>

<svelte:head>
  <title>Other Projects</title>
</svelte:head>

<div class="other-projects-page">
  <header>
    <p class="eyebrow">Portfolio</p>
    <h1>Additional Projects</h1>
    <p>A selection of additional engineering, robotics, and machine-learning work.</p>
  </header>

  <div class="project-list">
    {#each projects as project}
      <article>
        <h2>{project.title}</h2>
        <p class="meta">{project.location} &bull; {project.dates}</p>
        <p>{project.description}</p>

        {#if project.media && project.captions}
          <div class="rehab-media">
            {#if project.media[rehabMediaIndex].endsWith('.mp4')}
              <video use:autoplayWhenVisible controls muted loop playsinline preload="metadata">
                <source src={project.media[rehabMediaIndex]} type="video/mp4" />
                <track kind="captions" src="/rehab-driving/no-dialogue.vtt" srclang="en" label="No dialogue" default />
                Your browser does not support embedded video.
              </video>
            {:else}
              <img src={project.media[rehabMediaIndex]} alt={project.captions[rehabMediaIndex]} />
            {/if}
            <button type="button" on:click={() => nextRehabMedia(project.media?.length ?? 1)}>
              View next media
            </button>
            <p class="media-caption">{project.captions[rehabMediaIndex]}</p>
          </div>
        {/if}
      </article>
    {/each}
  </div>
</div>

<style>
  .other-projects-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
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
    margin: 0 0 0.75rem;
    font-size: clamp(2.2rem, 6vw, 4rem);
  }

  .project-list {
    display: grid;
    gap: 0;
    border-top: 1px solid #ccc;
  }

  article {
    padding: 1.6rem 0;
    border-bottom: 1px solid #ccc;
  }

  h2 {
    margin: 0 0 0.35rem;
    font-size: 1.35rem;
  }

  article p {
    margin: 0.45rem 0 0;
    line-height: 1.6;
  }

  .meta {
    color: #666;
    font-size: 0.95rem;
    font-style: italic;
  }

  .rehab-media {
    margin-top: 1.25rem;
    text-align: center;
  }

  .rehab-media video,
  .rehab-media img {
    display: block;
    width: min(100%, 760px);
    max-height: 520px;
    margin: 0 auto;
    border-radius: 8px;
    background: #000;
    box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
    object-fit: contain;
  }

  .rehab-media button {
    margin-top: 0.75rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid #777;
    border-radius: 0.4rem;
    background: white;
    color: #222;
    cursor: pointer;
  }

  .rehab-media button:hover,
  .rehab-media button:focus-visible {
    background: #f0f0f0;
  }

  .media-caption {
    margin-top: 0.6rem;
    color: #444;
    font-size: 0.9rem;
  }
</style>
