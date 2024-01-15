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
	songRatingsStore.subscribe((value) => {
		songRatings = value;
	});
	let allMp3Urls = {};
	let waveSurfer;
	let totalMp3s = 0;
	$: currentFileName = writable('loading...');
	$: currentDuration = writable(0);
	let tempRating;
	let demoNotes = '';
	const totalRatings = derived(
		songRatingsStore,
		($songRatingsStore) => Object.keys($songRatingsStore).length
	);

	$: buttonClass = {
		1: tempRating === 1 ? 'bg-red-600' : 'bg-red-800',
		2: tempRating === 2 ? 'bg-yellow-600' : 'bg-yellow-800',
		3: tempRating === 3 ? 'bg-green-600' : 'bg-green-800'
	};

	function extractFileName(url) {
		return url.split('/').pop().split('?')[0];
	}

	function setRating(rating) {
		tempRating = rating;
	}

	function secondsToMinutesAndSeconds(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes} minutes ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} seconds`;
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
		waveSurfer.load(randomUrl);

		waveSurfer.on('loading', (percent) => {
			$currentFileName = 'loading...';
		});

		waveSurfer.on('ready', () => {
			$currentDuration = secondsToMinutesAndSeconds(waveSurfer.getDuration());
			$currentDuration = $currentDuration; // Trigger a re-render
			$currentFileName = extractFileName(randomUrl); // Set to the actual file name when ready
			$currentFileName = $currentFileName; // Trigger a re-render
		});
	}

	onMount(async () => {
		waveSurfer = WaveSurfer.create({
			container: '#waveform',
			waveColor: 'violet',
			progressColor: 'purple',
			barWidth: 2,
			barGap: 1,
			barRadius: 2
		});

		// Hover effect
		{
			const hover = document.querySelector('#hover');
			const waveform = document.querySelector('#waveform');
			waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`));
		}

		// Current time & duration
		{
			const formatTime = (seconds) => {
				const minutes = Math.floor(seconds / 60);
				const secondsRemainder = Math.round(seconds) % 60;
				const paddedSeconds = `0${secondsRemainder}`.slice(-2);
				return `${minutes}:${paddedSeconds}`;
			};

			const timeEl = document.querySelector('#time');
			const durationEl = document.querySelector('#duration');
			waveSurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration)));
			waveSurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)));
		}

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
		<p class="text-lg">
			There are <span class="font-bold">{totalMp3s}</span> demos in the library, and you have voted
			on <span class="font-bold">{$totalRatings} </span>demos.
		</p>
	</div>

	<div class="w-3/5 mx-auto content-left bg-teal-950 p-5">
		<div class="my-5 italic">
			<p>
				Please note that these are unmastered demos and audio levels may require considerable
				adjustment for proper listening.
			</p>
			<p>Please also allow a few moments for the audio files to load in the player.</p>
		</div>
		<h3>Now Playing: {$currentFileName}</h3>
		<p>{$currentDuration}</p>
	</div>

	<div class="audiocontainer w-3/5 mx-auto bg-teal-950">
		<div id="waveform">
			<div id="time">0:00</div>
			<div id="duration">0:00</div>
			<div id="hover"></div>
		</div>
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
		<div class="voteContainer mt-5 pb-10">
			<div class="mb-3">
				<p>
					Vote on this simple scale your feelings about the piece of music you are listening to.
				</p>
				<p>
					Roughly, a 3 means you feel this piece definitely deserves release and only requires
					minimal work to reach that state. A 2 suggests that you see promise to the piece, but it
					may need some effort to get into a releasable state. A 1 suggests this idea should be, at
					very least, set aside for some later date, or perhaps binned completely.
				</p>
			</div>

			<button on:click={() => setRating(1)} class="m-2 p-2 text-slate-200 {buttonClass[1]}"
				>1</button
			>
			<button on:click={() => setRating(2)} class="m-2 p-2 text-slate-200 {buttonClass[2]}"
				>2</button
			>
			<button on:click={() => setRating(3)} class="m-2 p-2 text-slate-200 {buttonClass[3]}"
				>3</button
			>
			<button on:click={registerVote} class="m-1 p-2 bg-violet-800 text-slate-200 text-sm"
				>Vote and Load Another</button
			>
			<button on:click={loadRandomMp3} class="m-1 p-2 bg-violet-800 text-slate-200 text-sm"
				>Load another without voting</button
			>
		</div>
	</div>
</div>

<style>
	    #waveform {
      cursor: pointer;
      position: relative;
    }
    #hover {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      pointer-events: none;
      height: 100%;
      width: 0;
      mix-blend-mode: overlay;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    #waveform:hover #hover {
      opacity: 1;
    }
    #time,
    #duration {
      position: absolute;
      z-index: 11;
      top: 50%;
      margin-top: -1px;
      transform: translateY(-50%);
      font-size: 9px;
      background: rgba(79, 78, 78, 0.75);
      padding: 2px;
      color: #ddd;
    }
    #time {
      left: 0;
    }
    #duration {
      right: 0;
    }

</style>