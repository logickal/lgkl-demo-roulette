<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import WaveSurfer from 'wavesurfer.js';

  export let data;
  let waveSurfer;
  let allMp3Urls = data.mp3Urls;
  let listenedUrls = new Set();
  let currentFileName = writable('');
  let currentDuration = writable(0);

  function extractFileName(url) {
    return url.split('/').pop().split('?')[0];
  }

  async function loadRandomMp3() {
    let randomUrl;
    do {
        randomUrl = allMp3Urls[Math.floor(Math.random() * allMp3Urls.length)];
    } while (listenedUrls.has(randomUrl) && listenedUrls.size < allMp3Urls.length);

    listenedUrls.add(randomUrl);
    currentFileName.set(extractFileName(randomUrl));
    waveSurfer.load(randomUrl);
  }

  onMount(async() => {
    waveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });

    waveSurfer.on('ready', () => {
      currentDuration.set(waveSurfer.getDuration());
    });

    // If 'data.mp3Urls' is a Promise, wait for it to resolve
    if (data.mp3Urls instanceof Promise) {
      allMp3Urls = await data.mp3Urls;
    } else {
      allMp3Urls = data.mp3Urls;
    }

    loadRandomMp3();
  });

  function playPause() {
    waveSurfer.playPause();
  }
</script>

<div>
    <h1>Logickal Roulette</h1>
    <p>This app will simply play a random piece from Logickal's collection of ambient demos from 2023.</p>    
    <div>
        <h3>Now Playing: {$currentFileName}</h3>
        <p>{$currentDuration} seconds</p>
    </div>
</div>

<div>
    <div id="waveform"></div>
    <button on:click={playPause}>Play/Pause</button>
    <button on:click={loadRandomMp3}>Load Random MP3</button>

</div>

