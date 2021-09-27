<script lang="ts">
    import Layout from "./shared/Layout.svelte";

    let error = sessionStorage.getItem("__error");
    if (error) {
        sessionStorage.removeItem("__error");
    }
</script>

<Layout>
    <div class="container">
        <h1 class="text-danger">Error.</h1>
        <h2 class="text-danger">An error occurred while processing your request.</h2>
        {#if error}
        <p id="error-label">
            Here is what we know:
        </p>
        <p class="text-danger">
            {error}
        </p>
        {/if}
    </div>
</Layout>
