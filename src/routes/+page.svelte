<script>
	import Registration from './Registration.svelte';
	import Player from './Player.svelte';
	import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';
	import {onMount} from 'svelte';
	import {songRatingsStore} from './songRatingStore.js';
	
	export let data;
	
	let username = loadFromLocalStorage('lgk-roulette-username') || '';

	async function onUserRegistered(event) {
		username = event.detail.username;
		let response = await fetch('/getUserData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username })
		});
		if (response.ok) {
			const songRatings = await response.json();
			songRatingsStore.set(songRatings);
			saveToLocalStorage('lgk-roulette-songRatings', songRatings);
		}
	}

	async function handleUpdate(event) {
		const songRatings = event.detail.songRatings;
		songRatingsStore.set(songRatings);
		fetch('/setUserData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, songRatings })
		});
		saveToLocalStorage('lgk-roulette-songRatings', songRatings);

}

onMount(async () => {
	if (username) {
		let response = await fetch('/getUserData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username })
		});
		if (response.ok) {
			let songRatings = await response.json();
			songRatingsStore.set(songRatings);
			saveToLocalStorage('lgk-roulette-songRatings', songRatings);
		}
	}
});
</script>

<div class="container mx-auto content-center">
	<div class="mx-auto content-center w-3/5 mb-6 bg-teal-900">
		<h1 class="text-2xl">Logickal Roulette</h1>
		<p>Playing random pieces from Logickal's collection of ambient demos from 2023.</p>
	</div>

	{#if !username}
		<Registration on:registered={onUserRegistered} />
	{:else}
		<Player {data} on:update={handleUpdate} />
	{/if}
</div>

<style lang="postcss">
	:global(html, body) {
		height: 100%;
		background-color: theme('colors.gray.800');
		color: theme('colors.gray.500');
	}
:global(body) {
		background-image: theme('backgroundImage.main-bg-image');
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
