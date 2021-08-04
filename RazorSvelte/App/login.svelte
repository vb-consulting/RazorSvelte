<script>
    import Layout from "./shared/Layout.svelte";
</script>

<Layout>
    <div class="container text-center m-5">
        <ul class="list-group">
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="/signin-google">Login With Google</a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="/signin-linkedin">Login With LinkedIn</a>
            </li>
            <li class="list-group-item">
                <a class="btn btn-primary btn-lg" href="/signin-github">Login With GitHub</a>
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
    li {
        border: 0;
    }
</style>
