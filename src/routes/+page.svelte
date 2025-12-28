<script lang="ts">
    import type { PageData } from './$types';
    import type { Game } from '$lib/types';

    export let data: PageData;

    let games: Game[] = data.dbGameData;
</script>

<h1>Welcome to Courier's GameShelf</h1>

{#if games.length > 0}
    {#each games as game}
        <p>{game.name}</p>
        <p>{game.release_date}</p>
        <p>{game.genre}</p>
        <p>{game.description}</p>
        <p>{game.platforms}</p>
        <img src="{game.cover_art}" alt="Cover Art for {game.name}" />
    {/each}
{:else}
    <p>No games found</p>
{/if}