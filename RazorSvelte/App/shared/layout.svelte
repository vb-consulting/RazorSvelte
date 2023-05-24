<script lang="ts">
    //import Layout from "$layout/simple-header.svelte";
    import Layout from "$lib/layouts/sidebar-layout.svelte";
    import Links from "$shared/sidebar-links.svelte";
    export let title: string | undefined = undefined;
</script>

<Layout {title}>
    <svelte:fragment slot="links"><Links /></svelte:fragment>
    <slot />
</Layout>
