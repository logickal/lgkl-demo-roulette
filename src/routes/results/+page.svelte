<!-- src/routes/Results.svelte -->
<script>
    import { onMount } from 'svelte';
    import TableCell from './TableCell.svelte';

    let songData = {};

    onMount(async () => {
        const response = await fetch('/getResults');
        songData = await response.json();
    });

</script>

<div class="container mx-auto content-center h-screen">
	<div class="mx-auto content-center w-7/8 mb-6 p-10 bg-teal-950">
        <h1 class="text-4xl">Results</h1>

        <table class="text-slate-300 table-auto border-separate border-spacing-2 border border-slate-500">
            <thead class="text-2xl text-slate-500">
                <tr>
                    <th>Song</th>
                    <th>Ratings</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {#each Object.entries(songData) as [song, data]}
                    <tr>
                        <TableCell data={song} />
                        <TableCell data={data.ratings.join(', ')} />
                        <TableCell data={data.notes.join(', ')} />
                    </tr>
                {/each}
            </tbody>
        </table>

    </div>
</div>


<style lang="postcss">
	:global(html, body) {
		height: 100%;
		background-color: theme('colors.gray.800');
		color: theme('colors.gray.500');
		background-image: theme('backgroundImage.main-bg-image');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
:global(body) {

	}
	:global(h1) {
		color: theme('colors.slate.100');
		font-size: larger;
	}
	:global(h3) {
		color: theme('colors.slate.100');
		font-size: large;
	}
	:global(p) {
		color: theme('colors.slate.100');
		font-size: small;
	}
	:global(button) {
		border-radius: 8%;
	}

</style>