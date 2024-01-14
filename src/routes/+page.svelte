<script>
	import Registration from './Registration.svelte';
	import Player from './Player.svelte';
	import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';
	import {onMount} from 'svelte';
	import {songRatingsStore} from './Store.js';
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
			console.log('getUserdata responseok')
			console.log("loading song ratings on mount")
			const songRatings = await response.json();
			console.log(songRatings);
			songRatingsStore.set(songRatings);
			saveToLocalStorage('lgk-roulette-songRatings', songRatings);
		}
	}

	async function handleUpdate(event) {
		const songRatings = event.detail.songRatings;
		console.log(songRatings);
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
	console.log('onmount');
	console.log('the username we see at mount is: ' + username);
	if (username) {
		console.log('username exists, fetching user data');
		let response = await fetch('/getUserData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username })
		});
		if (response.ok) {
			console.log('responseok')
			console.log("loading song ratings on mount")
			let songRatings = await response.json();
			console.log(songRatings);
			saveToLocalStorage('lgk-roulette-songRatings', songRatings);
		}
	}
});
</script>

<div class="container mx-auto content-center">
	<div class="mx-auto content-center w-3/5 pb-6">
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
