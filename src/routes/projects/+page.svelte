<script lang="ts">
  import { autoplayWhenVisible } from '$lib/autoplayWhenVisible';
  import OtherProjectsPage from '../other-projects/OtherProjectsPage.svelte';

  export let mode: 'research' | 'projects' = 'projects';

  // Load all images from /static/ADAPT folder once
  const adaptImages = Object.keys(import.meta.glob('/static/ADAPT/*.{jpg,jpeg,png}', { eager: true }))
    .map(path => path.replace('/static', ''));

  // Dummy captions for ADAPT images — just to demo, repeat same captions for all projects
  const adaptCaptions = [
    ['Team brainstorming and prototyping'],
    ['Prosthetic arm controlled via EEG/EMG'],
    ['Real-time signal processing setup']
  ];

  const projects = [
    {
      title: 'Hybrid Simulation and EMG-Controlled Upper-Limb Exoskeleton',
      location: 'Penn GRASP Laboratory · Philadelphia, PA',
      dates: 'Jun 2025 – Present',
      description: `Developed a MuJoCo musculoskeletal digital twin using inverse dynamics, PD control, and quadratic programming, reproducing measured elbow kinematics with a mean tracking RMSE of 1.866°.
Built a causal temporal convolutional network that predicts subject-specific biceps and triceps EMG for unseen controller configurations at real-time-capable latency.
Integrated surface EMG, OptiTrack motion capture, motor torque, and exoskeleton encoder data across participants, external loads, and controller configurations.`,
      images: [
        '/project-media/exoskeleton/exosim.gif',
        '/project-media/exoskeleton/exo.png'
      ],
      captions: [
        ['Digital-twin and musculoskeletal simulation comparison'],
        ['EMG-controlled upper-limb exoskeleton prototype']
      ],
    },
    {
      title: 'EMG-Based Achilles Tendinopathy Classification',
      location: 'Penn GRASP Laboratory · Philadelphia, PA',
      dates: 'Aug 2023 – Present',
      description: `Developed a real-time high-density EMG collection pipeline using custom 3D-printed hardware and laser-cut MMX/silicon fabric electrodes.
Built a 3D variational autoencoder to quantify injury severity, assess laterality, and classify rehabilitation exercises.
Detected Achilles tendinopathy in an average of 20 of 21 held-out evaluations and classified healthy, unilateral, and bilateral pathology in 18 of 21.`,
      images: [],
      captions: [],
      mediaNotice: 'Publication Pending, images withheld!'
    },
    {
      title: 'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture',
      location: 'University of Pennsylvania · Philadelphia, PA',
      dates: 'Aug 2025 – May 2026',
      description: `Co-developed an assistive medical device using ultrasound-based bone detection and real-time angle feedback to guide lumbar-puncture needle trajectories.
Designed the enclosure and interface, integrated the ultrasound transducer, motor, angle sensor, and control electronics, and tested acoustic acquisition on tissue and spinal phantoms.
Validated angle sensing and LED feedback within 1° across controlled targets; the prototype achieved 80% optimal needle-path detection and 95% bone-detection accuracy.`,
      images: [
        '/project-media/verdigris/verdigris-rotate.gif',
        '/project-media/verdigris/verdigris.png'
      ],
      captions: [
        ['Rotating CAD model of the Verdigris enclosure'],
        ['Verdigris assistive ultrasound guidance prototype']
      ],
    },
    {
      title: 'Ember Social Robotics Platform',
      location: 'Tadashi Robotics · Philadelphia, PA',
      dates: 'Aug 2025 – Present',
      description: `Translating Ember from an academic social-robotics research platform into an early-stage product for rehabilitative patient support and naturalistic human–robot interaction.
Designed the mechanical enclosure and embedded architecture across wireless communication, audio I/O, vision, display, power, and motor-control hardware.
Developed LLM-based interaction logic for reminiscence dialogue and emergency guidance and supported human-subject research submissions.`,
      images: ['/project-media/ember/ember-first-prototype.mp4'],
      captions: [['1st prototype of Ember']],
    },
    {
      title: 'PENN Assistive Devices and Prosthetic Technologies (ADAPT)',
      location: 'Philadelphia, PA',
      dates: 'Jan 2023 – May 2026',
      description: `Led an undergraduate team in designing of upper limb prosthetics with EEG and EMG control.
Designed a prosthetic arm and hand connected to an Arduino & Raspberry Pi system for real-time brain signal control.
Implemented multiple machine learning models to classify user grasping mechanisms.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'Cockroach Interface',
      location: 'Philadelphia, PA',
      dates: 'Oct 2024',
      description: `Created a physical game inspired by the ”Hole in the Wall” show, controlling cockroach movement via EMG signals.
Implemented real-time EMG feature extraction and hardware filtering using custom circuit design.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'Rehabilitative Driving Simulator',
      location: 'Kingston, Jamaica',
      dates: 'Jan 2023 – May 2023',
      description: `Collaborated with engineers and clinicians in Jamaica to develop a Unity-based driving simulator for pediatric patients with hemiplegia.
Created custom steering and pedal controls and fabricated the supporting mechanical, electrical, and sensor-integrated components.`,
      images: [
        '/rehab-driving/patient-first-use.mp4',
        '/rehab-driving/learning-tools.jpg',
        '/rehab-driving/finished-steering-wheel.jpg'
      ],
      captions: [
        ['Patient using the device for the first time!'],
        ['Learning how to use tools'],
        ['Finished steering wheel setup']
      ],
    },
    {
      title: 'Social DinoBot',
      location: 'Philadelphia, PA',
      dates: 'Aug 2024 – Dec 2024',
      description: `Designed a mobile dinosaur social robot to aid gait rehabilitation for an ischemic stroke patient.
Fabricated wooden chassis for lightweight frame and modular assembly.
Implemented various modes of communication for assistance with aphasia and speech rehabilitation.`,
      images: ['/project-media/dinobot/dinobot.jpg'],
      captions: [['Social DinoBot rehabilitation prototype']],
    },
    {
      title: 'AI Image to GPS Localization',
      location: 'Philadelphia, PA',
      dates: 'Jan 2025 – May 2025',
      description: `Developed a deep learning pipeline to infer geographic location from a hand-collected dataset of images.
Implemented the Image2GPS algorithm using a ResNet-18 backbone and custom layers.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'PENN Tikkun Olam Makers',
      location: 'Philadelphia, PA',
      dates: 'Aug 2023 – May 2024',
      description: `Designed a laser-cuttable, adaptable wheelchair for children with physical disabilities.
Developed assistive toothbrush mechanisms in collaboration with Penn Dental.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'KUKA Arm Competition',
      location: 'Philadelphia, PA',
      dates: 'Aug 2023 – Dec 2023',
      description: `Worked in a team to develop an inverse dynamics control algorithm for building towers with a KUKA robotic arm.
Made a custom inverse kinematics algorithm for obstructing other teams’ building process.
Implemented velocity control linked with AprilTag object recognition to grab materials in dynamic environments.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'AI Human Content Generator',
      location: 'Philadelphia, PA',
      dates: 'Aug 2024 – Dec 2024',
      description: `Created an OpenPose to Stable Diffusion machine learning pipeline for art generation for social media users.
Deployed a GUI using Gradio for online user image uploads.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'HVAC Monitoring and Surveillance System',
      location: 'Ithaca, NY',
      dates: 'Mar 2024',
      description: `Modeled affordable devices for detecting airborne bacteria and fungi utilizing hospital HVAC systems.
Created front-end GUI to monitor the spread of airborne diseases in monitored spaces.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
  ];

  const researchProjectTitles = new Set([
    'Hybrid Simulation and EMG-Controlled Upper-Limb Exoskeleton',
    'EMG-Based Achilles Tendinopathy Classification'
  ]);

  const featuredProjectTitles = new Set([
    'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture',
    'Ember Social Robotics Platform',
    'Social DinoBot',
    'Rehabilitative Driving Simulator'
  ]);

  $: displayedProjects = projects.filter((project) =>
    (mode === 'research' ? researchProjectTitles : featuredProjectTitles).has(project.title)
  );

  const projectIds: Record<string, string> = {
    'Hybrid Simulation and EMG-Controlled Upper-Limb Exoskeleton': 'project-exoskeleton',
    'EMG-Based Achilles Tendinopathy Classification': 'project-achilles',
    'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture': 'project-verdigris',
    'Ember Social Robotics Platform': 'project-ember',
    'Rehabilitative Driving Simulator': 'project-rehab-driving',
    'Social DinoBot': 'project-dinobot'
  };

  // Track current image index per project
  let currentIndexes = projects.map(() => 0);
  let expandedProjects = new Set<string>();
  let otherProjectsExpanded = false;

  function toggleProjectDetails(title: string) {
    const nextExpandedProjects = new Set(expandedProjects);

    if (nextExpandedProjects.has(title)) {
      nextExpandedProjects.delete(title);
    } else {
      nextExpandedProjects.add(title);
    }

    expandedProjects = nextExpandedProjects;
  }

  function nextSlide(projIdx: number) {
    currentIndexes[projIdx] = (currentIndexes[projIdx] + 1) % projects[projIdx].images.length;
  }
</script>

<style>
  .portfolio-wrapper {
    max-width: 1200px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .project-row {
    display: flex;
    gap: 2rem;
    align-items: center;
    scroll-margin-top: 70px;
  }

  .portfolio-header {
    margin-bottom: -1rem;
  }

  .portfolio-header .eyebrow {
    margin: 0 0 0.35rem;
    color: #666;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .portfolio-header h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3.25rem);
  }

  .project-row:not(:last-child) {
    padding-bottom: 4rem;
    border-bottom: 1px solid #c9c9c9;
  }

  .project-row.even {
    flex-direction: row;
  }

  .project-row.odd {
    flex-direction: row-reverse;
  }

  .text-block, .image-block {
    flex: 1;
  }

  .text-block {
    text-align: left;
  }

  .image-block {
    text-align: center;
  }

  .media-notice {
    display: grid;
    min-height: 220px;
    padding: 2rem;
    place-items: center;
    border: 1px dashed #777;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.035);
    color: #555;
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
  }

  .project-header {
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .project-meta {
    font-style: italic;
    color: #555;
    margin-bottom: 1rem;
  }

  .project-description {
    white-space: pre-line;
    margin-bottom: 1rem;
  }

  .project-details {
    margin: 0 0 1rem;
    padding: 0.85rem 1rem;
    border-left: 3px solid #777;
    background: rgba(0, 0, 0, 0.04);
  }

  .read-more-button {
    padding: 0.5rem 0.85rem;
    border: 1px solid #777;
    border-radius: 0.4rem;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
  }

  .read-more-button:hover,
  .read-more-button:focus-visible {
    background: rgba(0, 0, 0, 0.08);
  }

  button.image-wrapper {
    display: block;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    user-select: none;
  }

  button.image-wrapper img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 520px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  }

  button.image-wrapper img:hover {
    transform: scale(1.05);
  }

  button.image-wrapper:focus {
    outline: 2px solid #555;
  }

  ul.caption-list {
    margin-top: 0.75rem;
    padding-left: 0;
    list-style: none;
    color: #444;
  }

  ul.caption-list li {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .project-video {
    display: block;
    width: 100%;
    max-height: 520px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: #000;
  }

  .ember-video {
    aspect-ratio: 4 / 3;
    object-fit: cover;
    object-position: center;
  }

  .next-media {
    margin-top: 0.75rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid #777;
    border-radius: 0.4rem;
    background: white;
    color: #222;
    cursor: pointer;
  }

  .next-media:hover {
    background: #f0f0f0;
  }

  .other-projects-toggle {
    max-width: 1200px;
    margin: 1rem auto 4rem;
    padding: 2rem 1rem 0;
    border-top: 1px solid #c9c9c9;
    text-align: center;
    scroll-margin-top: 70px;
  }

  .other-projects-button {
    padding: 0.8rem 1.2rem;
    border: 1px solid #333;
    border-radius: 0.5rem;
    background: #333;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .other-projects-button:hover,
  .other-projects-button:focus-visible {
    background: #555;
  }

  .other-projects-content {
    margin-top: 1rem;
    text-align: left;
  }

  @media (max-width: 900px) {
    .portfolio-wrapper {
      margin-right: 1rem;
      margin-left: 1rem;
    }

    .project-row, .project-row.even, .project-row.odd {
      flex-direction: column !important;
      align-items: center;
      text-align: center;
    }

    .text-block, .image-block {
      width: 100%;
    }

    button.image-wrapper img,
    .project-video {
      max-height: 70vh;
    }
  }
</style>

<div class="portfolio-wrapper">
  <header class="portfolio-header">
    <p class="eyebrow">Portfolio</p>
    <h2>{mode === 'research' ? 'Research Projects' : 'Projects'}</h2>
  </header>

  {#each displayedProjects as project, i}
    {@const projectIndex = projects.indexOf(project)}
    <div id={projectIds[project.title]} class="project-row {i % 2 === 0 ? 'even' : 'odd'}">
      <div class="text-block">
        <div class="project-header">{project.title}</div>
        <div class="project-meta">{project.location} &bull; {project.dates}</div>
        <div class="project-description">{project.description}</div>
        {#if expandedProjects.has(project.title)}
          <div class="project-details">Work in progress</div>
        {/if}
        <button
          class="read-more-button"
          type="button"
          aria-expanded={expandedProjects.has(project.title)}
          on:click={() => toggleProjectDetails(project.title)}
        >
          {expandedProjects.has(project.title) ? 'Read less' : 'Read more'}
        </button>
      </div>

      <div class="image-block">
        {#if project.mediaNotice}
          <div class="media-notice" role="note">{project.mediaNotice}</div>
        {:else if project.images[currentIndexes[projectIndex]].endsWith('.mp4')}
          <video
            use:autoplayWhenVisible
            class="project-video"
            class:ember-video={project.title === 'Ember Social Robotics Platform'}
            controls
            muted
            loop
            playsinline
            preload="metadata"
          >
            <source src={project.images[currentIndexes[projectIndex]]} type="video/mp4" />
            <track kind="captions" src="/rehab-driving/no-dialogue.vtt" srclang="en" label="No dialogue" default />
            Your browser does not support embedded video.
          </video>
        {:else}
          <button
            class="image-wrapper"
            on:click={() => nextSlide(projectIndex)}
            aria-label="Cycle project {project.title} media"
            title="Click or press Enter/Space to view next item"
            type="button"
          >
            <img
              src={project.images[currentIndexes[projectIndex]]}
              alt={`Media ${currentIndexes[projectIndex] + 1} for ${project.title}`}
            />
          </button>
        {/if}
        {#if !project.mediaNotice && project.images.length > 1}
          <button class="next-media" on:click={() => nextSlide(projectIndex)} type="button">
            View next media
          </button>
        {/if}
        {#if project.captions && project.captions.length > 0}
          <ul class="caption-list">
            {#each project.captions[currentIndexes[projectIndex]] as captionLine}
              <li>{captionLine}</li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/each}

</div>

{#if mode === 'projects'}
  <div id="other-projects" class="other-projects-toggle">
    <button
      class="other-projects-button"
      type="button"
      aria-expanded={otherProjectsExpanded}
      aria-controls="other-projects-content"
      on:click={() => (otherProjectsExpanded = !otherProjectsExpanded)}
    >
      {otherProjectsExpanded ? 'Minimize Other Projects' : 'Click here to expand Other Projects'}
    </button>

    {#if otherProjectsExpanded}
      <div id="other-projects-content" class="other-projects-content">
        <OtherProjectsPage />
      </div>
    {/if}
  </div>
{/if}
