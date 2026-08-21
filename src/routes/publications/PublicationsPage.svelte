<script lang="ts">
  type PublicationAuthor = {
    name: string;
    equal?: boolean;
    highlighted?: boolean;
  };

  type Publication = {
    authors: PublicationAuthor[];
    title: string;
    status: string;
  };

  const publications: Publication[] = [
    {
      authors: [
        { name: 'Maggie Wagner', equal: true },
        { name: 'Sanghyub Lee', equal: true },
        { name: 'Nathaniel Kim', equal: true, highlighted: true },
        { name: 'Michael North', equal: true },
        { name: 'Nadia Figueroa' },
        { name: 'Josh Baxter' },
        { name: 'Flavia Vitale' }
      ],
      title: 'Latent HD-sEMG Representation Learning for Achilles Tendinopathy Assessment',
      status: 'Pending submission to IEEE Transactions on Neural Systems and Rehabilitation Engineering, 2026.'
    },
    {
      authors: [
        { name: 'Sanghyub Lee' },
        { name: 'Nathaniel Kim', highlighted: true },
        { name: 'Dhyey Shah' },
        { name: 'Jason Chen' },
        { name: 'Nadia Figueroa' }
      ],
      title: 'Musculoskeletal Digital Twin Modeling for Biomechanical State Estimation During Weighted Elbow Flexion',
      status: 'Under review for the 2026 IEEE-RAS International Conference on Humanoid Robots (Humanoids).'
    }
  ];

  function authorSeparator(index: number, count: number) {
    if (index === count - 1) return '';
    if (index === count - 2) return ', and ';
    return ', ';
  }
</script>

<div class="publications-page">
  <header>
    <p class="eyebrow">Research Output</p>
    <h1>Publications</h1>
  </header>

  <div class="publication-list">
    {#each publications as publication}
      <article>
        <p class="authors">
          {#each publication.authors as author, index}
            <span class:highlighted={author.highlighted}>{author.name}</span>{#if author.equal}<sup>&amp;</sup>{/if}{authorSeparator(index, publication.authors.length)}
          {/each}
        </p>
        <h2>{publication.title}</h2>
        <p class="status">{publication.status}</p>
      </article>
    {/each}
  </div>

  <p class="equal-note"><sup>&amp;</sup> Equal contribution.</p>
</div>

<style>
  .publications-page {
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

  .publication-list {
    border-top: 1px solid #c9c9c9;
  }

  article {
    padding: 2rem 0;
    border-bottom: 1px solid #c9c9c9;
  }

  .authors,
  .status {
    margin: 0;
    line-height: 1.6;
  }

  .highlighted {
    font-weight: 800;
  }

  h2 {
    margin: 0.55rem 0;
    font-size: clamp(1.25rem, 3vw, 1.55rem);
    line-height: 1.35;
  }

  .status {
    color: #555;
    font-style: italic;
  }

  .equal-note {
    margin: 1rem 0 0;
    color: #555;
    font-size: 0.9rem;
  }
</style>
