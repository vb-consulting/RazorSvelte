<script lang="ts">
    export let diminishNavClass = "showNav";

    const offset = 0;
    const tolerance = 10;

    let y = 0;
    let lastY = 0;

    function updateHiddeStatusClass(y: number) {
        const dy = lastY - y;
        lastY = y;
        if (y < offset) {
            return "showNav";
        }
        if (Math.abs(dy) <= tolerance) {
            return diminishNavClass;
        }
        if (dy < 0) {
            return "hideNav";
        }
        return "showNav";
    }

    $: diminishNavClass = updateHiddeStatusClass(y);
</script>

<svelte:window bind:scrollY={y} />

<style lang="scss">
    :global(nav) {
        transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    :global(nav.showNav) {
        transform: translateY(0%);
    }
    :global(nav.hideNav) {
        transform: translateY(-100%);
    }
</style>
