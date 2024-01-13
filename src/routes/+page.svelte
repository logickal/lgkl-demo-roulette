<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import WaveSurfer from 'wavesurfer.js';
	import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';

	export let data;
	let waveSurfer;
	let allMp3Urls = data.mp3Urls;
	let totalMp3s = 0;
	let listenedUrls = new Set();
	let currentFileName = writable('loading...');
	let currentDuration = writable(0);
	let songRatings = loadFromLocalStorage('songRatings') || {};

	function extractFileName(url) {
		return url.split('/').pop().split('?')[0];
	}

	function rateSong(songName, rating) {
		songRatings[songName] = rating;
		saveToLocalStorage('songRatings', songRatings);
	}

	async function loadRandomMp3() {
		let randomUrl;
		do {
			randomUrl = allMp3Urls[Math.floor(Math.random() * allMp3Urls.length)];
		} while (
			songRatings[extractFileName(randomUrl)] !== undefined &&
			Object.keys(songRatings).length < allMp3Urls.length
		);

		currentFileName.set('loading...');
		waveSurfer.load(randomUrl);

		waveSurfer.on('loading', (percent) => {
			currentFileName.set('loading');
		});

		waveSurfer.on('ready', () => {
			currentDuration.set(waveSurfer.getDuration());
			console.log(randomUrl);
			currentFileName.set(extractFileName(randomUrl)); // Set to the actual file name when ready
		});
	}

	onMount(async () => {
		waveSurfer = WaveSurfer.create({
			container: '#waveform',
			waveColor: 'violet',
			progressColor: 'purple',
			// Set a bar width
			barWidth: 2,
			// Optionally, specify the spacing between bars
			barGap: 1,
			// And the bar radius
			barRadius: 2
		});

		// If 'data.mp3Urls' is a Promise, wait for it to resolve
		if (data.mp3Urls instanceof Promise) {
			allMp3Urls = await data.mp3Urls;
			totalMp3s = allMp3Urls.length;
		} else {
			allMp3Urls = data.mp3Urls;
			totalMp3s = allMp3Urls.length;
		}

		loadRandomMp3();
	});

	function playPause() {
		waveSurfer.playPause();
	}
</script>

<div class="container mx-auto content-center">
	<div class="mx-auto content-center w-3/5 pt-60 pb-24">
		<h1 class="text-2xl">Logickal Roulette</h1>
		<p>
			Playing random pieces from Logickal's collection of ambient demos from 2023. There are {totalMp3s}
			demos in the library. More statefulness is coming soon.
		</p>
	</div>

	<div class="w-3/5 mx-auto content-left">
		<h3>Now Playing: {$currentFileName}</h3>
		<p>{$currentDuration} seconds</p>
	</div>

	<div class="audiocontainer w-3/5 mx-auto">
		<div id="waveform"></div>
		<button on:click={playPause} class="m-2 p-2 bg-violet-800 text-slate-200">Play/Pause</button>
	</div>
  <div class="ratingContainer w-4/5 mx-auto">
    <button on:click={() => rateSong($currentFileName, 1)} class="m-2 p-2 bg-red-800 text-slate-200">1</button>
    <button on:click={() => rateSong($currentFileName, 2)} class="m-2 p-2 bg-yellow-800 text-slate-200">2</button>
    <button on:click={() => rateSong($currentFileName, 3)} class="m-2 p-2 bg-green-800 text-slate-200">3</button>
    <button on:click={loadRandomMp3} class="m-2 p-2 bg-violet-800 text-slate-200">Register the vote and load another random MP3</button>

  </div>
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
