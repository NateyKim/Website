<script>
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
      description: `Collaborated with a Jamaican rehabilitation center to create a low-cost driving simulator for a hemiplegic patient.
Created a responsive driving simulation game using Unity.
Fabricated mechanical and electrical components, including 3D-printed, wooden, and sensor-integrated parts.`,
      images: adaptImages,
      captions: adaptCaptions,
    },
    {
      title: 'Social DinoBot',
      location: 'Philadelphia, PA',
      dates: 'Aug 2024 – Dec 2024',
      description: `Designed a mobile dinosaur social robot to aid gait rehabilitation for an ischemic stroke patient.
Fabricated wooden chassis for lightweight frame and modular assembly.
Implemented various modes of communication for assistance with aphasia and speech rehabilitation.`,
      images: adaptImages,
      captions: adaptCaptions,
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

  // Track current image index per project
  let currentIndexes = projects.map(() => 0);

  function nextSlide(projIdx) {
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
  {#each projects as project, i}
    <div class="project-row {i % 2 === 0 ? 'even' : 'odd'}">
      <div class="text-block">
        <div class="project-header">{project.title}</div>
        <div class="project-meta">{project.location} &bull; {project.dates}</div>
        <div class="project-description">{project.description}</div>
      </div>

      <div class="image-block">
        <button
          class="image-wrapper"
          on:click={() => nextSlide(i)}
          aria-label="Cycle project {project.title} images"
          title="Click or press Enter/Space to view next image"
          type="button"
        >
          <img
            src={project.images[currentIndexes[i]]}
            alt={`Image ${currentIndexes[i] + 1} for ${project.title}`}
          />
        </button>
        {#if project.captions && project.captions.length > 0}
          <ul class="caption-list">
            {#each project.captions[currentIndexes[i]] as captionLine}
              <li>{captionLine}</li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/each}
</div>
