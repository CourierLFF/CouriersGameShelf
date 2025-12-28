<style>
    .error {
        color: red;
    }
</style>

<script lang="ts">
    import type { PageData } from './$types';
    import type { Game } from '$lib/types';

    export let data: PageData;
    export let form;

    let games: Game[] = data.returnedGames;
</script>

<h1>Welcome to Courier's GameShelf</h1>

{#if form?.error}
    <p class="error">{form.message}</p>
{/if}

<form method="POST">
    <label for="add-game">Add Game By ID:</label>
    <input type="text" id="add-game" name="add-game" required>

    <input type="submit" value="Add Game">
</form>

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