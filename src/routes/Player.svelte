<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import WaveSurfer from 'wavesurfer.js';
	import { createEventDispatcher } from 'svelte';
	import { songRatingsStore } from './songRatingStore.js';
	import { derived } from 'svelte/store';

	export let data;
	const dispatch = createEventDispatcher();

	let songRatings = {};
	songRatingsStore.subscribe(value => {
		songRatings = value;
	});
	let allMp3Urls;
	let waveSurfer;
	let totalMp3s = 0;
	let currentFileName = writable('loading...');
	let currentDuration = writable(0);
	let tempRating;
	let demoNotes = '';
	const totalRatings = derived(songRatingsStore, $songRatingsStore => Object.keys($songRatingsStore).length);


	$: buttonClass = {
    1: tempRating === 1 ? 'bg-red-600' : 'bg-red-800',
    2: tempRating === 2 ? 'bg-yellow-600' : 'bg-yellow-800',
    3: tempRating === 3 ? 'bg-green-600' : 'bg-green-800',
  };

	function extractFileName(url) {
		return url.split('/').pop().split('?')[0];
	}

	function setRating(rating) {
		console.log('setRating', rating);
		tempRating = rating;
	}

	function registerVote() {
		if (tempRating !== undefined) {
			const fileName = $currentFileName;
			songRatings[fileName] = { ...songRatings[fileName], rating: tempRating, notes: demoNotes };
			dispatch('update', { songRatings });
			tempRating = undefined;
			demoNotes = ''; // Reset notes after voting
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

		$currentFileName = 'loading...';
		console.log('Loading random mp3', randomUrl);
		waveSurfer.load(randomUrl);

		waveSurfer.on('loading', (percent) => {
			$currentFileName = 'loading...';
		});

		waveSurfer.on('ready', () => {
			console.log('Wavesurfer ready, should be setting the duration and filename here');
			$currentDuration = waveSurfer.getDuration();
			console.log(currentDuration);
			$currentFileName = extractFileName(randomUrl); // Set to the actual file name when ready
			console.log(currentFileName);
		});
	}

	onMount(async () => {
		console.log('Mounted wavesurfer');
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
	<div class="mx-auto content-center w-3/5 mb-12 p-5 bg-teal-950">
		<p>There are {totalMp3s} demos in the library, and you have voted on {$totalRatings} demos.</p>
	</div>

	<div class="w-3/5 mx-auto content-left bg-teal-950 p-5">
		<h3>Now Playing: {$currentFileName}</h3>
		<p>{$currentDuration} seconds</p>
	</div>

	<div class="audiocontainer w-3/5 mx-auto bg-teal-950">
		<div id="waveform"></div>
		<button on:click={playPause} class="m-2 p-2 bg-violet-800 text-slate-200">Play/Pause</button>
	</div>
	<div class="ratingContainer w-3/5 mx-auto bg-teal-950">
		<div class="textContainer mt-5">
			<textarea
				bind:value={demoNotes}
				placeholder="Enter any notes here from your listening"
				class="w-full h-24 p-30 rounded-md"
			></textarea>
		</div>
		<div class="voteContainer mt-5">
			<button on:click={() => setRating(1)} class="m-2 p-2 text-slate-200 {buttonClass[1]}">1</button>
			<button on:click={() => setRating(2)} class="m-2 p-2 text-slate-200 {buttonClass[2]}">2</button>
			<button on:click={() => setRating(3)} class="m-2 p-2 text-slate-200 {buttonClass[3]}">3</button>
			<button on:click={registerVote} class="m-1 p-2 bg-violet-800 text-slate-200 text-sm"
				>Vote and Load Another</button
			>
			<button on:click={loadRandomMp3} class="m-1 p-2 bg-violet-800 text-slate-200 text-sm"
				>Load another without voting</button
			>
		</div>
	</div>
</div>
