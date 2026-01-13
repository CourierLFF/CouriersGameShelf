<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="/" class="block text-3xl font-bold mb-10 text-center mt-10">Courier's GameShelf</a>

{@render children()}
