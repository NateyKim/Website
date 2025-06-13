<script>
  let name = 'world';
</script>

<h1 class="title">Hello {name}!</h1>

<input bind:value={name} placeholder="Type your name" />

<style>
  .title {
    font-size: 2rem;
    color: #ff3e00;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 5px;
  }
</style>
