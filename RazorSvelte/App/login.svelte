<script>
    import Layout from "./shared/layout/default";
    import urls from "./shared/urls";
</script>

<Layout>
    <div class="container text-center m-5">
        <ul class="list-group border-0">
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href="{urls.signInGoogleUrl}">
                    <i class="bi bi-google"></i>
                    Login With Google
                </a>
            </li>
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href="{urls.signInLinkedInUrl}">
                    <i class="bi bi-linkedin"></i>
                    Login With LinkedIn
                </a>
            </li>
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href="{urls.signInGitHubUrl}">
                    <i class="bi bi-github"></i>
                    Login With GitHub
                </a>
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
    .container {
        margin-top: 10%;
    }
</style>
    
