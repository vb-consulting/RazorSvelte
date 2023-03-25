<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import { errorKey } from "$lib/config";

    let error = sessionStorage.getItem(errorKey);
    if (error) {
        sessionStorage.removeItem(errorKey);
    }
</script>

<Layout>
    <div class="container">
        <h3 class="text-danger">
            <i class="material-icons">bug_report</i>
            Error :(
        </h3>
        {#if error}
            <div class="mt-3">
                Here is what we know so far: <div class="text-danger fw-bold fs-5">{error}</div>
            </div>
        {/if}
        <div class="mt-5 fs-6">
            Click <a href="/">here</a> to return to start screen and try again.
        </div>
    </div>
</Layout>

<style lang="scss">
</style>
