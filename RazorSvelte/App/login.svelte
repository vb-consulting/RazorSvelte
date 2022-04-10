<script>
    import Layout from "./shared/layout/main.svelte";
    import urls from "./shared/urls";
</script>

<Layout>
    <div class="container text-center m-5">
        <ul class="list-group">
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInGoogleUrl}">
                    <i class="bi bi-google"></i>
                    Login With Google
                </a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInLinkedInUrl}">
                    <i class="bi bi-linkedin"></i>
                    Login With LinkedIn
                </a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="{urls.signInGitHubUrl}">
                    <i class="bi bi-github"></i>
                    Login With GitHub
                </a>
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
    :global(main) {
        margin: auto;
    }
</style>
    
