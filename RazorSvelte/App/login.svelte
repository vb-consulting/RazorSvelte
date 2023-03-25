<script>
    import Layout from "$shared/layout.svelte";
    import Icon from "$visual/icon.svelte";
    import urls from "$shared/urls";
</script>

<Layout>
    <div class="container text-center mt-auto mb-auto">
        <ul class="list-group border-0">
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href={urls.signInGoogleUrl}>
                    <Icon bootstrap="google" />
                    Login With Google
                </a>
            </li>
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href={urls.signInLinkedInUrl}>
                    <Icon bootstrap="linkedin" />
                    Login With LinkedIn
                </a>
            </li>
            <li class="list-group-item border-0">
                <a class="btn btn-primary btn-lg" href={urls.signInGitHubUrl}>
                    <Icon bootstrap="github" />
                    Login With GitHub
                </a>
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
</style>
