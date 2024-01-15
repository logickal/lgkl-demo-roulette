<script>
	import { saveToLocalStorage } from '$lib/localStorage.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let inputUsername = '';

	function handleRegistration() {
		saveToLocalStorage('lgk-roulette-username', inputUsername);
		dispatch('registered', { username: inputUsername });
	}
</script>

<div class="registration w-3/5 p-5 m-5 content-center mx-auto bg-teal-900 ">
	<p>Enter some name or other string to identify your listening preferences and commentary to the Secret Chiefs.</p>
	<p>This identifier will be kept in your browser storage to allow you to return here and continue listening and voting.</p>
	<input type="text" bind:value={inputUsername} placeholder="Enter your name" />
	<button on:click={handleRegistration} disabled={!inputUsername} class="m-1 p-2 bg-violet-800 text-slate-200 text-sm">Register</button>
</div>
