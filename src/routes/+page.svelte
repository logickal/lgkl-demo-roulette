<script>
  import Registration from './Registration.svelte';
  import Player from './Player.svelte';
	import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';
	
  export let data;
  let username = '';

  function onUserRegistered(event) {
    username = event.detail.username;
  }

</script>

<div class="container mx-auto content-center">
	<div class="mx-auto content-center w-3/5 pb-6">
		<h1 class="text-2xl">Logickal Roulette</h1>
		<p>
			Playing random pieces from Logickal's collection of ambient demos from 2023.</p>
	</div>

  {#if !username}
    <Registration on:registered={onUserRegistered} />
  {:else}
    <Player data={data} />
  {/if}

</div>

<style lang="postcss">
	:global(html, body) {
		height: 100%;
		background-color: theme('colors.gray.800');
		color: theme('colors.gray.500');
	}
	:global(h1) {
		color: theme('colors.gray.100');
		font-size: larger;
	}
	:global(h3) {
		color: theme('colors.gray.100');
		font-size: large;
	}
	:global(p) {
		color: theme('colors.gray.100');
		font-size: small;
	}
	:global(button) {
		border-radius: 8%;
	}
</style>
