<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
</script>

<Header />
<main>
    <slot></slot>
</main>
<Footer />