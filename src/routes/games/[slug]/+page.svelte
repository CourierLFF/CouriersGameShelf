<script lang="ts">
    import { formatDate } from '$lib/utils';

    export let data;
</script>

{#if data.gameData}
<p>IGDB ID: {data.gameData.id}</p>
<img src="{data.gameData.cover_art}" alt="{data.gameData.name} Cover Art">
<p>{data.gameData.name}</p>
<p>Release Date: {formatDate(data.gameData.release_date)}</p>
<p>{data.gameData.description}</p>
<p>Genres: {data.gameData.genres}</p>
<p>Platforms: {data.gameData.platforms}</p>

{:else if data.error}
<p>{data.error}</p>
{/if}