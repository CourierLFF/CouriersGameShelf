<script>
    export let form;
</script>

<div class="flex justify-center items-center h-screen flex-col gap-10">
    <div>
        <h1 class="text-4xl">Login</h1>

        {#if form?.error}
            <p class="text-red-500 text-center">{form.message}</p>
        {/if}
    </div>

    <div>
        <form method="POST" class="card w-full max-w-md preset-filled-surface-100-900 p-10 text-center">
            <label for="username" class="text-xl mr-4">Username:</label>
            <input type="text" id="username" name="username" class="bg-gray-500 rounded-md p-2" required><br><br>

            <label for="password" class="text-xl mr-4">Password:</label>
            <input type="password" id="password" name="password" class="bg-gray-500 rounded-md p-2" required><br><br>

            <input type="submit" value="Login" class="btn present-filled bg-white text-black">
        </form>  
    </div>  
</div>