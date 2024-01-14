<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import WaveSurfer from 'wavesurfer.js';
	import { loadFromLocalStorage, saveToLocalStorage } from '$lib/localStorage.js';
	import { createEventDispatcher } from 'svelte';


	export let data;
	export let songRatingsProp
	const dispatch = createEventDispatcher();

	let songRatings = {};
	$: songRatings = { ...songRatingsProp };
	let allMp3Urls;
	let waveSurfer;
	let totalMp3s = 0;
	let currentFileName = writable('loading...');
	let currentDuration = writable(0);
	let tempRating;
	let demoNotes = '';
	let totalRatings = Object.keys(songRatings).length;

	function extractFileName(url) {
		return url.split('/').pop().split('?')[0];
	}

	function setRating(rating) {
		tempRating = rating;
	}

	function registerVote() {
		if (tempRating !== undefined) {
			const fileName = $currentFileName;
			songRatings[fileName] = { rating: tempRating, notes: demoNotes };
//			saveToLocalStorage('lgk-roulette-songRatings', songRatings);
			dispatch('update', { songRatings });
			tempRating = undefined;
			demoNotes = ''; // Reset notes after voting
			totalRatings = Object.keys(songRatings).length;
		}
		loadRandomMp3();
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

<div>
	<div class="mx-auto content-center w-3/5 pb-12">
		<p>There are {totalMp3s} demos in the library, and you have voted on {totalRatings} demos.</p>
	</div>

	<div class="w-3/5 mx-auto content-left">
		<h3>Now Playing: {$currentFileName}</h3>
		<p>{$currentDuration} seconds</p>
	</div>

	<div class="audiocontainer w-3/5 mx-auto">
		<div id="waveform"></div>
		<button on:click={playPause} class="m-2 p-2 bg-violet-800 text-slate-200">Play/Pause</button>
	</div>
	<div class="ratingContainer w-3/5 mx-auto">
		<div class="textContainer">
			<textarea
				bind:value={demoNotes}
				placeholder="Enter any notes here from your listening"
				class="w-full h-24 p-3 rounded-md"
			></textarea>
		</div>
		<div class="voteContainer">
			<button
				on:click={() => setRating(1)}
				class:bg-red-600={tempRating === 1}
				class="m-2 p-2 bg-red-800 text-slate-200">1</button
			>
			<button
				on:click={() => setRating(2)}
				class:bg-yellow-600={tempRating === 2}
				class="m-2 p-2 bg-yellow-800 text-slate-200">2</button
			>
			<button
				on:click={() => setRating(3)}
				class:bg-green-600={tempRating === 3}
				class="m-2 p-2 bg-green-800 text-slate-200">3</button
			>
			<button on:click={registerVote} class="m-1 p-2 bg-violet-800 text-slate-200"
				>Vote and Load Another</button
			>
			<button on:click={loadRandomMp3} class="m-1 p-2 bg-violet-800 text-slate-200"
				>Load another without voting</button
			>
		</div>
	</div>
</div>
