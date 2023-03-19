<script lang="ts">
    import Layout from "$layout/offcanvas-links.svelte";
    //import Layout from "$layout/simple-header.svelte";
    import Links from "$shared/link-list-items.svelte";
    export let title: string | undefined = undefined;
</script>

<Layout {title}>
    <svelte:fragment slot="links"><Links /></svelte:fragment>
    <slot />
</Layout>
