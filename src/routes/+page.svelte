<script lang="ts">
    import type { PageData } from './$types';
    import type { Game } from '$lib/types';

    export let data: PageData;

    let games: Game[] = data.dbGameData;
</script>

<h1>Welcome to Courier's GameShelf</h1>

{#if games.length > 0}
    <p>Game Name: {games[0].name}</p>
    <p>Release Date: {games[0].release_date}</p>
    <p>Game Genre: {games[0].genre}</p>
    <p>Game Description: {games[0].description}</p>
    <p>Game Platforms: {games[0].platforms}</p>
    <img src="{games[0].cover_art}" alt="Cover Art for {games[0].name}" />
{:else}
    <p>No games found</p>
{/if}