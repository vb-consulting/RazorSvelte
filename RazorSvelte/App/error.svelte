<script lang="ts">
    import Layout from "./shared/layout/default";
    import { get } from "./shared/config";

    let error: string | null;
    const key = get<string>("error-key");
    if (key) {
        error = sessionStorage.getItem(key);
        if (error) {
            sessionStorage.removeItem(key);
        }
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

<style lang="scss">
    :global(main) {
        margin: auto;
    }
</style>
    