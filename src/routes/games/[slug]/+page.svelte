<script lang="ts">
    import { formatDate } from '$lib/utils';
    import { enhance } from '$app/forms';

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
        <form method="POST" action="?/removeGame" use:enhance>
            <input type="hidden" name="remove-game" value="{data.gameData.id}">
            <input type="submit" value="Remove Game">
        </form>

        <form method="POST" action="?/updateGameState" use:enhance>
            <input type="hidden" name="updated-game" value="{data.gameData.id}">
            <label for="new-game-state-{data.gameData.id}">Change Game State:</label>
            <select id="new-game-state-{data.gameData.id}" name="new-game-state">
                <option value="Playing" selected={data.gameData.game_state === 'Playing'}>Playing</option>
                <option value="Backlog" selected={data.gameData.game_state === 'Backlog'}>Backlog</option>
                <option value="Completed" selected={data.gameData.game_state === 'Completed'}>Completed</option>
                <option value="Dropped" selected={data.gameData.game_state === 'Dropped'}>Dropped</option>
            </select>
            <input type="submit" value="Update State">
        </form>
        {:else}    
            <form method="POST" class="add-game-form" action="?/addGame" use:enhance>

                <label for="game-state">Select Game State:</label>
                <select id="game-state" name="game-state">
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
        {/if}
{:else if data.error}
    <p>{data.error}</p>
{/if}