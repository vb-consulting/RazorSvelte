<script>
    import Header from "./shared/Header.svelte";
    import Footer from "./shared/Footer.svelte";
</script>

<Header />
<main>
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
</main>
<Footer />

<style lang="scss">
    li {
        border: 0;
    }
</style>
