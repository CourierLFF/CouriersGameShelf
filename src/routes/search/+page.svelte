<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Game } from '$lib/types';
    import { formatDate } from '$lib/utils';
    import type { PageData } from '../$types';

    const { data, form } = $props<{ data: PageData; form?: any }>();

    let currentSearchedGames = $derived(() =>
        form && !form.error && form.data ? (form.data as Game[]) : null
    );
</script>

<form method="POST" class="search-game-form flex flex-col justify-center items-center gap-10 border-2 border-gray-700 bg-gray-900 rounded-lg p-6 mx-20 my-10" action="?/searchGame" use:enhance>
    <div>
        <label for="search-query" class="text-xl mr-2">Search Game:</label>
        <input type="text" id="search-query" name="search-query" class="bg-gray-500 rounded-md p-2" required>
    </div>
    <!-- <input type="submit" value="Search" class="btn present-filled bg-white text-black"> -->
     <!-- {#if form && !form.error && form.data} -->
      {#if currentSearchedGames}
        <div class="w-[75%]">
            <h2 class="text-xl font-bold">Search Results:</h2>
          {#each currentSearchedGames() as game}
                <div>
                    <div class="flex py-4 gap-6">
                        <div>
                            <a href="/games/{game.id}"><img src="{game.cover_art}" alt="{game.name} Cover Art" class="w-32 h-auto mb-2" /></a>
                        </div>
                        <div class="flex flex-col gap-4 justify-center">
                            <a href="/games/{game.id}" class="text-2xl">{game.name}</a>
                            <p>IGDB ID: {game.id}</p>
                            <p>Release Date: {formatDate(game.release_date)}</p>
                        </div>
                    </div>
                    <hr />
                </div>
            {/each}
        </div>
    {/if}
</form>