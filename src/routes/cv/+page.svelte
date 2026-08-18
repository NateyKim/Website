<script lang="ts">
  const cvUrl = '/CV.pdf';
</script>

<div class="cv-page">
  <div class="cv-header">
    <h2>CV</h2>
    <a href={cvUrl} target="_blank" rel="noreferrer">Open CV</a>
  </div>

  <iframe src={cvUrl} title="Nathaniel Kim's CV"></iframe>

  <p class="cv-fallback">
    If the PDF viewer does not load, <a href={cvUrl} download>download the CV</a>.
  </p>
</div>

<style>
  .cv-page {
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    padding: 2rem clamp(1rem, 4vw, 3rem) 3rem;
    background: #f5f5f5;
  }

  .cv-header {
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

  .cv-header a {
    flex: none;
    padding: 0.65rem 1rem;
    border-radius: 0.4rem;
    color: white;
    background: #333;
    text-decoration: none;
  }

  .cv-header a:hover {
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

  .cv-fallback {
    width: min(100%, 960px);
    margin: 0.75rem auto 0;
    color: #555;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .cv-page {
      padding: 1.25rem 0.75rem 2rem;
    }

    iframe {
      height: 75vh;
      min-height: 500px;
    }
  }
</style>
