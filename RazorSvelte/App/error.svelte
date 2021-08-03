<script lang="ts">
    import Header from "./shared/Header.svelte";
    import Footer from "./shared/Footer.svelte";

    let error = sessionStorage.getItem("__error");
    if (error) {
        sessionStorage.removeItem("__error");
    }
</script>

<Header />
<main>
    <div class="container">
        <h1 class="text-danger">Error.</h1>
        <h2 class="text-danger">An error occurred while processing your request.</h2>
        
        {#if error}
        <p id="error-label">
            Here is what we know:
        </p>
        <p class="text-danger">
            {error}
        </p>
        {/if}
    </div>
</main>
<Footer />