<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1>Welcome to Courier's GameShelf</h1>

<p>Game Name: {data.gameData[0].name}</p>