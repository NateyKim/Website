<script lang="ts">
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
      dates: 'Jan 2023 – Present',
      description: `Developed a MuJoCo musculoskeletal digital twin using inverse dynamics, PD control, and quadratic programming, reproducing measured elbow kinematics with a mean tracking RMSE of 1.866°.
Built a causal temporal convolutional network that predicts subject-specific biceps and triceps EMG for unseen controller configurations at real-time-capable latency.
Integrated surface EMG, OptiTrack motion capture, motor torque, and exoskeleton encoder data across participants, external loads, and controller configurations.`,
      images: [
        '/project-media/exoskeleton/exo.png',
        '/project-media/exoskeleton/exosim.gif'
      ],
      captions: [
        ['EMG-controlled upper-limb exoskeleton prototype'],
        ['Digital-twin and musculoskeletal simulation comparison']
      ],
    },
    {
      title: 'EMG-Based Achilles Tendinopathy Classification',
      location: 'Penn GRASP Laboratory · Philadelphia, PA',
      dates: 'Aug 2023 – Present',
      description: `Developed a real-time high-density EMG collection pipeline using custom 3D-printed hardware and laser-cut MMX/silicon fabric electrodes.
Built a 3D variational autoencoder to quantify injury severity, assess laterality, and classify rehabilitation exercises.
Detected Achilles tendinopathy in an average of 20 of 21 held-out evaluations and classified healthy, unilateral, and bilateral pathology in 18 of 21.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture',
      location: 'University of Pennsylvania · Philadelphia, PA',
      dates: 'Aug 2025 – May 2026',
      description: `Co-developed an assistive medical device using ultrasound-based bone detection and real-time angle feedback to guide lumbar-puncture needle trajectories.
Designed the enclosure and interface, integrated the ultrasound transducer, motor, angle sensor, and control electronics, and tested acoustic acquisition on tissue and spinal phantoms.
Validated angle sensing and LED feedback within 1° across controlled targets; the prototype achieved 80% optimal needle-path detection and 95% bone-detection accuracy.`,
      images: [
        '/project-media/verdigris/verdigris.png',
        '/project-media/verdigris/verdigris-rotate.gif'
      ],
      captions: [
        ['Verdigris assistive ultrasound guidance prototype'],
        ['Rotating CAD model of the Verdigris enclosure']
      ],
    },
    {
      title: 'Ember Social Robotics Platform',
      location: 'Tadashi Robotics · Philadelphia, PA',
      dates: 'Aug 2025 – Present',
      description: `Translating Ember from an academic social-robotics research platform into an early-stage product for rehabilitative patient support and naturalistic human–robot interaction.
Designed the mechanical enclosure and embedded architecture across wireless communication, audio I/O, vision, display, power, and motor-control hardware.
Developed LLM-based interaction logic for reminiscence dialogue and emergency guidance and supported human-subject research submissions.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'PENN Assistive Devices and Prosthetic Technologies (ADAPT)',
      location: 'Philadelphia, PA',
      dates: 'Jan 2023 – Present',
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
        '/rehab-driving/learning-tools.jpg',
        '/rehab-driving/finished-steering-wheel.jpg',
        '/rehab-driving/patient-first-use.mp4'
      ],
      captions: [
        ['Learning how to use tools'],
        ['Finished steering wheel setup'],
        ['Patient using the device for the first time!']
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
      dates: 'Aug 2023 – Present',
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

  const featuredProjectTitles = new Set([
    'Hybrid Simulation and EMG-Controlled Upper-Limb Exoskeleton',
    'EMG-Based Achilles Tendinopathy Classification',
    'Verdigris: Assistive Ultrasound Guidance for Lumbar Puncture',
    'Ember Social Robotics Platform',
    'Social DinoBot',
    'Rehabilitative Driving Simulator'
  ]);

  const featuredProjects = projects.filter((project) => featuredProjectTitles.has(project.title));

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
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    user-select: none;
  }

  button.image-wrapper img {
    max-width: 100%;
    max-height: 350px;
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
    max-height: 350px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    background: #000;
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

  @media (max-width: 900px) {
    .project-row, .project-row.even, .project-row.odd {
      flex-direction: column !important;
      align-items: center;
      text-align: center;
    }

    .text-block, .image-block {
      width: 100%;
    }
  }
</style>

<div class="portfolio-wrapper">
  {#each featuredProjects as project, i}
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
        {#if project.images[currentIndexes[projectIndex]].endsWith('.mp4')}
          <video class="project-video" controls playsinline preload="metadata">
            <source src={project.images[currentIndexes[projectIndex]]} type="video/mp4" />
            <track kind="captions" src="/rehab-driving/no-dialogue.vtt" srclang="en" label="No dialogue" default />
            Your browser does not support embedded video.
          </video>
          <button class="next-media" on:click={() => nextSlide(projectIndex)} type="button">
            View next media
          </button>
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
