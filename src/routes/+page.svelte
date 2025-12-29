<style>
    .error {
        color: red;
    }

    .tracked-game-states {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .add-game-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        max-width: 200px;
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

<form method="POST" class="add-game-form">
    <label for="add-game">Add Game By ID:</label>
    <input type="text" id="add-game" name="add-game" required>

    <label for="game-state">Select Game State:</label>
    <select id="game-state" name="game-state">
        <option value="Playing">Playing</option>
        <option value="Backlog" selected>Backlog</option>
        <option value="Completed">Completed</option>
        <option value="Dropped">Dropped</option>
    </select>

    <input type="submit" value="Add Game">
</form>

<div class="tracked-game-states">
    <button>Playing</button>
    <button>Backlog</button>
    <button>Completed</button>
    <button>Dropped</button>
</div>

{#if games.length > 0}
    {#each games as game}
        <p>{game.name}</p>
        <p>{game.release_date}</p>
        <p>{game.description}</p>
        <img src="{game.cover_art}" alt="Cover Art for {game.name}" />
        <p>Game State: {game.game_state}</p>
    {/each}
{:else}
    <p>No games found</p>
{/if}