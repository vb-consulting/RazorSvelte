<script lang="ts">
    import Header from "./shared/Header.svelte";
    import Footer from "./shared/Footer.svelte";
</script>

<Header />
<main>
    <div class="container text-center">
        <h1 class="text-danger">401 Unathorized Access</h1>
        
        <p>
            You might want to login by using the <a class="btn btn-primary btn-sm" href="/login">Login</a> page.
        </p>
    </div>
</main>
<Footer />