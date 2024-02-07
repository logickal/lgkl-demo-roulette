<!-- src/routes/Results.svelte -->
<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import TableCell from './TableCell.svelte';

    let songData = {};
    let group1 = writable([]), group2 = writable([]), group3 = writable([]);
    let ratingRanges = ['3.00', '2.00 - 2.99', '1.00 - 1.99'];


    function average(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    onMount(async () => {
        const response = await fetch('/getResults');
        songData = await response.json();

        let g1 = [], g2 = [], g3 = [];

        Object.entries(songData).forEach(([song, data]) => {
            let avgRating = average(data.ratings);
            if (avgRating >= 3) {
                g1.push({song, data});
            } else if (avgRating >= 2) {
                g2.push({song, data});
            } else {
                g3.push({song, data});
            }
        });

        // Sort each group alphabetically by song
        g1.sort((a, b) => a.song.localeCompare(b.song));
        g2.sort((a, b) => a.song.localeCompare(b.song));
        g3.sort((a, b) => a.song.localeCompare(b.song));

        $group1 = g1;
        $group2 = g2;
        $group3 = g3;
    });
</script>



<div class="container mx-auto content-center h-screen">
    {#each [$group1, $group2, $group3] as group, i (group)}
    <div class="mx-auto content-center w-7/8 mb-6 p-10 bg-teal-950">
        <h2 class="text-2xl">Results (Average Rating: {ratingRanges[i]}, Total: {group.length})</h2>

        <table class="text-slate-300 table-auto border-separate border-spacing-2 border border-slate-500">
            <thead class="text-2xl text-slate-500">
                <tr>
                    <th>Song</th>
                    <th>Ratings</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {#each group as {song, data}}
                    <tr>
                        <TableCell data={song} />
                        <TableCell data={data.ratings.join(', ')} />
                        <TableCell data={data.notes.join(', ')} />
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/each}
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