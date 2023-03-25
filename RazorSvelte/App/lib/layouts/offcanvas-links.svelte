<script lang="ts">
    import { onDestroy, afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "$element/tooltips";
    import UserMenu from "$layout/_user-menu.svelte";
    import DiminishingNav from "$layout/_diminishing-nav.svelte";
    import Offcanvas from "$overlay/offcanvas.svelte";
    import Icon from "$visual/icon.svelte";
    import { title as configTitle } from "$lib/config";

    export let title: string | undefined = undefined;

    if (!title) {
        title = configTitle;
    }

    interface $$Slots {
        default: {};
        links: {};
    }

    const pinnedKey = "sidebar-pinned";
    let pinned =
        localStorage.getItem(pinnedKey) == null ? true : localStorage.getItem(pinnedKey) == "true";

    $: {
        localStorage.setItem(pinnedKey, pinned.toString());
        document.title = title as string;
    }

    let offcanvas = { open: false };
    let offcanvasRef: HTMLElement;
    let rotate: boolean = true;

    function useOffcanvas(e: HTMLElement) {
        offcanvasRef = e;
    }

    function toggleOffcanvas(state?: boolean) {
        rotate = !rotate;
        if (pinned) {
            pinned = false;
            return;
        }
        if (state == undefined) {
            offcanvas.open = !offcanvas.open;
        } else {
            offcanvas.open = state;
        }
    }

    let gutterTimeout: number | null;
    let bodyTimeout: number | null;
    let diminishNavClass: string;

    function gutterMouseover() {
        if (gutterTimeout) {
            clearInterval(gutterTimeout);
            gutterTimeout = null;
        }
        if (offcanvas.open) {
            return;
        }
        gutterTimeout = setTimeout(() => {
            if (
                !offcanvas.open &&
                document &&
                document.querySelectorAll(".gutter:hover").length > 0
            ) {
                offcanvas.open = true;
            }
            gutterTimeout = null;
        }, 500);
    }

    function bodyMouseover() {
        if (bodyTimeout) {
            clearInterval(bodyTimeout);
            bodyTimeout = null;
        }
        if (!offcanvas.open) {
            return;
        }
        if (offcanvasRef.querySelectorAll(".offcanvas-body:hover").length) {
            return;
        }
        bodyTimeout = setTimeout(() => {
            if (offcanvas.open && !offcanvasRef.querySelectorAll(".offcanvas-body:hover").length) {
                offcanvas.open = false;
            }
            bodyTimeout = null;
        }, 5000);
    }

    function togglePin() {
        pinned = !pinned;
    }

    onDestroy(() => {
        if (gutterTimeout) {
            clearInterval(gutterTimeout);
        }
        if (bodyTimeout) {
            clearInterval(bodyTimeout);
        }
    });

    beforeUpdate(hideTooltips);
    afterUpdate(createTooltips);
</script>

<svelte:body on:mouseover={bodyMouseover} />
<DiminishingNav bind:diminishNavClass />

{#if !pinned}
    {#if !offcanvas.open}
        <div
            class="gutter"
            on:mouseover={gutterMouseover}
            on:focus={gutterMouseover}
            on:keypress={() => toggleOffcanvas(true)}
            on:click={() => toggleOffcanvas(true)} />
    {/if}

    <Offcanvas
        state={offcanvas}
        class="offcanvas-nav bg-primary navbar-dark"
        on:hidden={() => toggleOffcanvas(false)}
        use={useOffcanvas}>
        <button
            class="btn btn-sm btn-primary pin unpinned material-icons-outlined {diminishNavClass}"
            on:click={togglePin}
            data-bs-toggle="tooltip"
            title="Pin sidebar">push_pin</button>

        <ul class="navbar-nav flex-column {diminishNavClass}">
            <slot name="links" />
        </ul>
    </Offcanvas>
{/if}

<header>
    <nav class="navbar navbar-expand-md fixed-top bg-primary py-0 py-md-0 {diminishNavClass}">
        <div class="container-fluid">
            <div class="d-flex float-start">
                <button
                    class="btn btn-sm btn-primary logo animate-rotate {rotate
                        ? 'rotate'
                        : 'rotate-back'}"
                    on:click={() => toggleOffcanvas()}>
                    <Icon material="menu" materialType="outlined" />
                    <span class="">{title}</span>
                </button>
            </div>

            <div class="d-flex float-end">
                <UserMenu />
            </div>
        </div>
    </nav>
</header>

<main class:pinned-layout={pinned}>
    <div class="offcanvas-nav bg-primary navbar-dark" class:d-none={!pinned}>
        <ul class="navbar-nav flex-column position-fixed {diminishNavClass}">
            <slot name="links" />
        </ul>
        <div class="position-fixed pin-wrap">
            <button
                type="button"
                class="btn btn-sm btn-primary pin material-icons-outlined {diminishNavClass}"
                on:click={togglePin}
                data-bs-toggle="tooltip"
                title="Unpin sidebar">push_pin</button>
        </div>
    </div>
    <slot />
</main>

<style lang="scss">
    @import "../scss/variables";
    @import "../scss/layout";

    $sidebar-width: 290px;
    $height: 48px;

    main {
        & > :global(*:nth-child(2)) {
            margin-top: 1.5rem;
        }
    }

    nav {
        min-height: $height;
        & .logo {
            & > *,
            & > :global(*) {
                vertical-align: middle !important;
            }
        }
    }

    ul.navbar-nav.showNav {
        margin-top: $height;
    }
    ul.navbar-nav.hideNav {
        margin-top: 0;
    }

    :global(.offcanvas-nav) {
        width: $sidebar-width !important;
        min-width: $sidebar-width !important;
        padding: 0;
    }
    :global(.offcanvas-nav > .offcanvas-body) {
        padding: 1rem 0;
    }
    :global(.offcanvas-nav > .offcanvas-body) {
        padding: 1rem 0;
    }
    :global(.offcanvas-nav .nav-item) {
        padding-right: 3rem;
    }
    :global(.offcanvas-nav .nav-item > .nav-link) {
        padding-left: 1rem;
        border-left: solid 3px transparent;
    }
    :global(.offcanvas-nav .nav-item > .nav-link:hover) {
        border-left: solid 3px rgba($white, 0.55);
    }
    .gutter {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 6px;
        background-color: transparent;
    }
    .gutter:hover {
        background-color: $primary;
        opacity: 0.25;
    }

    .pin {
        position: absolute;
        background-color: transparent;
        top: 50px;
        right: 10px;
    }
    .pin.showNav {
        top: 50px;
    }
    .pin.hideNav {
        top: 0;
    }

    .unpinned {
        transform: rotateY(0deg) rotate(45deg);
        transition: transform 2s;
    }
    .pinned-layout {
        display: grid;
        grid-template-columns: $sidebar-width auto;
        height: 100%;
        width: 100%;
        & > div.offcanvas-nav {
            position: relative;
            margin-top: -16px;
        }

        & .pin-wrap {
            top: 0px;
            left: 290px;
        }
    }
    .pin {
        font-size: 0.75rem;
    }

    .animate-rotate {
        & > :global(i) {
            transition: transform 0.25s ease-in-out;
        }
    }
    .rotate {
        & > :global(i) {
            transform: rotate(0deg);
        }
    }
    .rotate-back {
        & > :global(i) {
            transform: rotate(180deg);
        }
    }
</style>
