<script lang="ts">
    import { formatDate } from '$lib/utils';

    export let data;

    let gameTracked = false;
    if (data.allGames && data.gameData) {
        for (let i = 0; i < data.allGames.length; i++) {
            if (data.allGames[i].id === data.gameData.id) {
                gameTracked = true;
                break;
            }
        }
    }
</script>

{#if data.gameData}
    <p>IGDB ID: {data.gameData.id}</p>
    <img src="{data.gameData.cover_art}" alt="{data.gameData.name} Cover Art">
    <p>{data.gameData.name}</p>
    <p>Release Date: {formatDate(data.gameData.release_date)}</p>
    <p>{data.gameData.description}</p>
    <p>Genres: {data.gameData.genres}</p>
    <p>Platforms: {data.gameData.platforms}</p>
    {#if gameTracked}
        <p>Game is in the database.</p>
    {/if}
{:else if data.error}
    <p>{data.error}</p>
{/if}