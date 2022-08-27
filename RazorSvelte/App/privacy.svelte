<script lang="ts">
    import Layout from "./shared/layout/default";
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
    .container {
        margin-top: 10%;
    }
</style>


