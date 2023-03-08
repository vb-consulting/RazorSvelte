<script lang="ts">
    import Layout from "../lib/offcanvas-layout.svelte";
    //import Layout from "../lib/header-layout.svelte";
    import Links from "./link-list-items.svelte";

    export let title: string | undefined = undefined;
</script>

<Layout {title}>
    <svelte:fragment slot="links"><Links /></svelte:fragment>
    <slot />
</Layout>
