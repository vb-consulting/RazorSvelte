<script lang="ts">
    import { onDestroy } from "svelte";

    const showClass = "show-nav";
    const hideClass = "hide-nav";

    export let diminishNavClass = showClass;
    export let element: HTMLElement | undefined = undefined;

    const offset = 10;
    const tolerance = 10;

    let winScrollY = 0;
    let lastY = 0;

    let curr: number | undefined;
    let prev: number | undefined;

    function getNewClass(y: number) {
        const dy = lastY - y;
        lastY = y;
        if (y < offset) {
            return showClass;
        }
        if (Math.abs(dy) <= tolerance) {
            return diminishNavClass;
        }
        if (dy < 0) {
            return hideClass;
        }
        return showClass;
    }

    function onscroll() {
        const newDiminishNavClass = getNewClass(element ? element.scrollTop : winScrollY);
        curr = Date.now();
        if (newDiminishNavClass !== diminishNavClass && (!prev || curr - prev > 100)) {
            diminishNavClass = newDiminishNavClass;
            prev = curr;
        }
    }

    $: {
        if (element) {
            element.addEventListener("scroll", onscroll);
        } else {
            onscroll();
        }
    }
    onDestroy(() => element?.removeEventListener("scroll", onscroll));
</script>

<svelte:window bind:scrollY={winScrollY} />

<style lang="scss">
    :global(nav) {
        transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }
    :global(nav.show-nav) {
        transform: translateY(0%);
    }
    :global(nav.hide-nav) {
        transform: translateY(-100%);
    }
</style>
