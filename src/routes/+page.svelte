<script>
  import { onMount } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';
  import { getAllMp3Urls } from '$lib/aws.js';
 
  let waveSurfer;
  let allMp3Urls = [];
  let listenedUrls = new Set();

  async function loadRandomMp3() {
    if (allMp3Urls.length === 0) {
      allMp3Urls = await getAllMp3Urls();
    }
    
    let randomUrl;
    do {
      randomUrl = allMp3Urls[Math.floor(Math.random() * allMp3Urls.length)];
    } while (listenedUrls.has(randomUrl) && listenedUrls.size < allMp3Urls.length);

    listenedUrls.add(randomUrl);
    waveSurfer.load(randomUrl);
  }

  onMount(() => {
    waveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });

    loadRandomMp3();
  });

  function playPause() {
    waveSurfer.playPause();
  }
</script>

<div>
    <h1>Logickal Roulette</h1>
    <p>This app will simply play a random piece from Logickal's collection of ambient demos from 2023.</p>    
</div>

<div>
    <div id="waveform"></div>
    <button on:click={playPause}>Play/Pause</button>
    <button on:click={loadRandomMp3}>Load Random MP3</button>

</div>

