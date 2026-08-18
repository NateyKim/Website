<script lang="ts">
  const resumeUrl = '/Resume2025.pdf';
</script>

<div class="resume-page">
  <div class="resume-header">
    <h2>Resume</h2>
    <a href={resumeUrl} target="_blank" rel="noreferrer">Open PDF</a>
  </div>

  <iframe src={resumeUrl} title="Nathaniel Kim's resume"></iframe>

  <p class="resume-fallback">
    If the PDF viewer does not load, <a href={resumeUrl} download>download the resume</a>.
  </p>
</div>

<style>
  .resume-page {
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    padding: 2rem clamp(1rem, 4vw, 3rem) 3rem;
    background: #f5f5f5;
  }

  .resume-header {
    width: min(100%, 960px);
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }

  .resume-header a {
    flex: none;
    padding: 0.65rem 1rem;
    border-radius: 0.4rem;
    color: white;
    background: #333;
    text-decoration: none;
  }

  .resume-header a:hover {
    background: #555;
  }

  iframe {
    display: block;
    width: min(100%, 960px);
    height: max(700px, calc(100vh - 180px));
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    background: white;
    box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
  }

  .resume-fallback {
    width: min(100%, 960px);
    margin: 0.75rem auto 0;
    color: #555;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .resume-page {
      padding: 1.25rem 0.75rem 2rem;
    }

    iframe {
      height: 75vh;
      min-height: 500px;
    }
  }
</style>
