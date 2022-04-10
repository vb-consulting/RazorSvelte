<script lang="ts">
    import Layout from "./shared/layout/main.svelte";
    import { get } from "./shared/config";

    let title = get<string>("title");
</script>

<Layout>
    <div class="container">
        <h1>{title}</h1>
        <p>Use this page to detail your site's privacy policy.</p>
    </div>
</Layout>

<style lang="scss">
:global(main) {
    margin: auto;
}
</style>


