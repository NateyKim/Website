<script context="module" lang="ts">
  import { redirect } from '@sveltejs/kit';

  export function load() {
    throw redirect(307, '/about-me');
  }
</script>
