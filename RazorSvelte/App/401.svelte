<script lang="ts">
    import Layout from "./shared/layout/main.svelte";
    import urls from "./shared/urls";
</script>

<Layout>
    <div class="container text-center">
        <h1 class="text-danger">401 Unathorized Access</h1>
        
        <p>
            You might want to login by using the <a class="btn btn-outline-secondary btn-sm" href="{urls.loginUrl}">Login</a> page.
        </p>
    </div>
</Layout>

<style lang="scss">
    :global(main) {
        margin: auto;
    }
</style>
    