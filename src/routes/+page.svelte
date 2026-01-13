<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import type { Game } from '$lib/types';
    import { goto } from '$app/navigation';

    const { data, form } = $props<{ data: PageData; form?: any }>();

    let games: Game[] = $derived(data.returnedGames);

    let currentSearchedGames = $derived(() =>
        form && !form.error && form.data ? (form.data as Game[]) : null
    );

    let currentState: string = $state('Backlog');

    let currentlyShownGames = $derived(() => {
        return games.filter((game) => game.game_state === currentState);
    });


</script>

{#if form?.error}
    <p class="text-red-500">{form.message}</p>
{/if}

<button class="btn present-filled bg-white text-black" onclick={() => goto('/search')}>Search Games</button>

<form method="POST" class="flex flex-col gap-10 mb-20 max-w-50 ml-10 border-2 border-gray-700 rounded-lg p-6" action="?/addGame" use:enhance>
    <label for="add-game">Add Game By IGDB ID:</label>
    <input type="text" id="add-game" name="add-game" class="bg-gray-500 rounded-md p-2" required>

    <label for="game-state">Select Game State:</label>
    <select id="game-state" name="game-state" class="bg-gray-500 rounded-md p-2">
        <option value="Playing">Playing</option>
        <option value="Backlog" selected>Backlog</option>
        <option value="Completed">Completed</option>
        <option value="Dropped">Dropped</option>
    </select>

    <label for="user-rating">Your Rating (0-100):</label>
    <select id="user-rating" name="user-rating">
        <option value="0" selected>No Rating</option>
        {#each Array(20) as _, index}
            <option value="{(index + 1) * 5}">{(index + 1) * 5}</option>
        {/each}
    </select>

    <input type="submit" value="Add Game">
</form>


<div class="my-20 flex justify-center gap-10">
    <button onclick={() => currentState = 'Playing'}>Playing</button>
    <button onclick={() => currentState = 'Backlog'}>Backlog</button>
    <button onclick={() => currentState = 'Completed'}>Completed</button>
    <button onclick={() => currentState = 'Dropped'}>Dropped</button>
</div>

{#if games.length > 0}
    {#each currentlyShownGames() as game}
        <p>IGDB ID: {game.id}</p>
        <p>{game.name}</p>
        <p>{game.release_date}</p>
        <p>{game.description}</p>
        <p>Genres: {game.genres}</p>
        <p>Platforms: {game.platforms}</p>
        <img src="{game.cover_art}" alt="Cover Art for {game.name}" />
        <p>Game State: {game.game_state}</p>
        <p>Your Rating: {game.user_rating ? game.user_rating : 'No Rating'}</p>
        {#if currentState === 'Completed'}
            <p>Date Completed: {game.date_completed}</p>
        {/if}
        <form method="POST" action="?/removeGame" use:enhance>
            <input type="hidden" name="remove-game" value="{game.id}">
            <input type="submit" value="Remove Game">
        </form>

        <form method="POST" action="?/updateGameState" use:enhance>
            <input type="hidden" name="updated-game" value="{game.id}">
            <label for="new-game-state-{game.id}">Change Game State:</label>
            <select id="new-game-state-{game.id}" name="new-game-state">
                <option value="Playing" selected={game.game_state === 'Playing'}>Playing</option>
                <option value="Backlog" selected={game.game_state === 'Backlog'}>Backlog</option>
                <option value="Completed" selected={game.game_state === 'Completed'}>Completed</option>
                <option value="Dropped" selected={game.game_state === 'Dropped'}>Dropped</option>
            </select>
            <input type="submit" value="Update State">
        </form>
    {/each}
{:else}
    <p>No games found</p>
{/if}