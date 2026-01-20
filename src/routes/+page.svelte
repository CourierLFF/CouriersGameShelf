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

    let addGameShow = $state(false);


</script>

{#if form?.error}
    <p class="text-red-500">{form.message}</p>
{/if}

<div class="flex flex-col items-center gap-6">
    <button class="text-3xl btn present-filled bg-white text-black" onclick={() => goto('/search')}>Search Games</button>
    <button class="text-3xl btn present-filled bg-white text-black" onclick={() => addGameShow = !addGameShow}>Add Game</button>

    {#if addGameShow}
        <form method="POST" class="flex flex-col gap-10 mb-20 border-2 border-gray-700 rounded-lg p-6" action="?/addGame" use:enhance>
            <div>
                <label for="add-game">IGDB ID:</label>
                <input type="text" id="add-game" name="add-game" class="bg-gray-500 rounded-md p-2" required>
            </div>
            <div>
                <label for="game-state">Select Game State:</label>
                <select id="game-state" name="game-state" class="bg-gray-500 rounded-md p-2">
                    <option value="Playing">Playing</option>
                    <option value="Backlog" selected>Backlog</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                </select>
            </div>
            <div>
                <label for="user-rating">Your Rating (0-100):</label>
                <select class="bg-gray-500 rounded-md p-2" id="user-rating" name="user-rating">
                    <option value="0" selected>No Rating</option>
                    {#each Array(20) as _, index}
                        <option value="{(index + 1) * 5}">{(index + 1) * 5}</option>
                    {/each}
                </select>
            </div>
            <input type="submit" value="Add Game" class="bg-gray-700 text-white rounded-md p-2 cursor-pointer">
        </form>
    {/if}
</div>



<div class="my-10 flex justify-center gap-10">
    <button class="bg-gray-700 text-white rounded-md p-2 cursor-pointer" onclick={() => currentState = 'Playing'}>Playing</button>
    <button class="bg-gray-700 text-white rounded-md p-2 cursor-pointer" onclick={() => currentState = 'Backlog'}>Backlog</button>
    <button class="bg-gray-700 text-white rounded-md p-2 cursor-pointer" onclick={() => currentState = 'Completed'}>Completed</button>
    <button class="bg-gray-700 text-white rounded-md p-2 cursor-pointer" onclick={() => currentState = 'Dropped'}>Dropped</button>
</div>

<h2 class="text-3xl font-bold mb-10 text-center">{currentState}</h2>
{#if games.length > 0}
    {#each currentlyShownGames() as game}
        <div class="flex mx-[20%] border-2 border-gray-700 bg-gray-900 rounded-lg p-6 my-10 items-center">
            <a href="/games/{game.id}"><img class="w-[60%]" src="{game.cover_art}" alt="Cover Art for {game.name}" /></a>
            <div class="flex flex-col justify-center mx-6 gap-4 w-[60%]">
                <a class="text-4xl" href="/games/{game.id}">{game.name}</a>
                <p>Your Rating: {game.user_rating ? game.user_rating + ' / 100' : 'No Rating'}</p>
                {#if currentState === 'Completed'}
                    <p>Date Completed: {game.date_completed}</p>
                {/if}
            </div>
            <div class="flex flex-col justify-center items-center gap-8">
                <div class="flex justify-center items-center gap-8">
                    <form method="POST" action="?/updateGameState" use:enhance>
                        <div class="flex flex-col gap-2">
                            <input type="hidden" name="updated-game" value="{game.id}">
                            <label for="new-game-state-{game.id}">Change State:</label>
                            <select class="bg-gray-700 rounded-md p-2" id="new-game-state-{game.id}" name="new-game-state">
                                <option value="Playing" selected={game.game_state === 'Playing'}>Playing</option>
                                <option value="Backlog" selected={game.game_state === 'Backlog'}>Backlog</option>
                                <option value="Completed" selected={game.game_state === 'Completed'}>Completed</option>
                                <option value="Dropped" selected={game.game_state === 'Dropped'}>Dropped</option>
                            </select>
                            <input type="submit" value="Update State" class="bg-gray-700 text-white rounded-md p-2 cursor-pointer">
                        </div>
                    </form>
                    <form method="POST" action="?/updateGameRating" use:enhance>
                        <div class="flex flex-col gap-2">
                            <input type="hidden" name="rated-game" value="{game.id}">
                            <label for="new-rating-{game.id}">Change Rating:</label>
                            <select class="bg-gray-700 rounded-md p-2" id="new-rating-{game.id}" name="new-rating">
                                <option value="0" selected={game.user_rating === null || game.user_rating === 0}>No Rating</option>
                                {#each Array(20) as _, index}
                                    <option value="{(index + 1) * 5}" selected={game.user_rating === (index + 1) * 5}>{(index + 1) * 5}</option>
                                {/each}
                            </select>
                            <input type="submit" value="Update Rating" class="bg-gray-700 text-white rounded-md p-2 cursor-pointer">
                        </div>
                    </form>
                </div>
                <form method="POST" action="?/removeGame" use:enhance>
                    <input type="hidden" name="remove-game" value="{game.id}">
                    <input type="submit" value="Remove Game" class="bg-gray-700 text-white rounded-md p-2 cursor-pointer">
                </form>
            </div>
        </div>
    {/each}
{:else}
    <p>No games found</p>
{/if}