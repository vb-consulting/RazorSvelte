<script lang="ts">
    import Header from "./header.svelte";
    import Footer from "./footer.svelte";
</script>

<Header />
<main>
    <slot></slot>
</main>
<Footer />