<script>
    import Layout from "./shared/Layout.svelte";
    import urls from "./shared/urls";
</script>

<Layout>
    <div class="container text-center m-5">
        <ul class="list-group">
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInGoogleUrl}">Login With Google</a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInLinkedInUrl}">Login With LinkedIn</a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInGitHubUrl}">Login With GitHub</a>
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
    li {
        border: 0;
    }
</style>
