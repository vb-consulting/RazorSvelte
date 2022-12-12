<script lang="ts">
    import Layout from "./shared/layout/default";
    import { errorKey } from "./shared/config";
    import urls from "./shared/urls";

    let error = sessionStorage.getItem(errorKey);
    if (error) {
        sessionStorage.removeItem(errorKey);
    }
</script>

<Layout>
    <div class="container">
        <h1 class="text-primary">
            <i class="bi bi-bug-fill text-danger"></i>
            Error :(
        </h1>
        {#if error}
            <div class="mt-3">
                Here is what we know so far: <div class="text-danger fw-bold fs-5">{error}</div>
            </div>
        {/if}
        <div class="mt-5 fs-6">
            Click <a href={urls.indexUrl}>here</a> to return to start screen and try again.
        </div>
    </div>
</Layout>

<style lang="scss">
    .container {
        margin-top: 50px;
    }
</style>
