<script lang="ts">
    import Layout from "./shared/layout.svelte";

    let error = sessionStorage.getItem("__error");
    if (error) {
        sessionStorage.removeItem("__error");
    }
</script>

<Layout>

    <div class="bx--content bx--toast-notification--error">
        <h1 class="">Error</h1>
        <p class="">
            An error occurred while processing your request.
        </p>
        {#if error}
        <p>
            Here is what we know:
        </p>
        <p class="bx--btn--danger">
            {error}
        </p>
        {/if}
    </div>
</Layout>
