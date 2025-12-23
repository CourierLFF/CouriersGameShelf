<style>
    .error {
        color: red;
    }
</style>

<script>
    export let form;
</script>

<h1>Welcome to login</h1>

{#if form?.error}
    <p class="error">{form.message}</p>
{/if}

<form method="POST">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required><br><br>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required><br><br>

    <input type="submit" value="Login">
</form>