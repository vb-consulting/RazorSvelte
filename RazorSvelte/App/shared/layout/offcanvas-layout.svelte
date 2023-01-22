<script lang="ts">
    import { onDestroy, afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "../../lib/tooltips";
    import Offcanvas from "../../lib/offcanvas.svelte";
    import Links from "./link-list-items.svelte";
    import { user, title as configTitle } from "../config";
    import urls from "../urls";
    import { isDarkTheme } from "./theme";

    export let title: string = configTitle;
    
    const pinnedKey = "sidebar-pinned";
    let pinned = localStorage.getItem(pinnedKey) == null ? true : localStorage.getItem(pinnedKey) == "true";
    
    $: {
        localStorage.setItem(pinnedKey, pinned.toString());
        document.title = title;
    }

    let offcanvas = {open: false};
    let offcanvasRef: HTMLElement;

    function useOffcanvas(e: HTMLElement) {
        offcanvasRef = e;
    }

    function toggleOffcanvas(state?: boolean) {
        if (pinned) {
            pinned = false;
            return;
        }
        if (state == undefined) {
            offcanvas.open = !offcanvas.open
        } else {
            offcanvas.open = state;
        }
    }

    let gutterTimeout: NodeJS.Timeout | null;
    let bodyTimeout: NodeJS.Timeout | null;

    function gutterMouseover() {
        if (gutterTimeout) {
            clearInterval(gutterTimeout);
            gutterTimeout = null;
        }
        if (offcanvas.open) {
            return;
        }
        gutterTimeout = setTimeout(() => {
            if (!offcanvas.open && document && document.querySelectorAll(".gutter:hover").length > 0) {
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

{#if !pinned}
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#if !offcanvas.open}<div class="gutter" on:mouseover={gutterMouseover} on:click={() => toggleOffcanvas(true)}></div>{/if}
    <Offcanvas state={offcanvas} class="offcanvas-nav navbar-dark bg-primary" on:hidden={() => toggleOffcanvas(false)} use={useOffcanvas}>
        <button class="btn btn-sm btn-primary pin bi-pin-angle" on:click={togglePin} data-bs-toggle="tooltip" title="Pin sidebar"></button>
        <ul class="navbar-nav navbar-dark flex-column mt-4">
            <Links />
        </ul>
    </Offcanvas>
{/if}

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0">
        <div class="container-fluid">

            <div class="d-flex float-start">
                <button class="btn btn-primary" on:click={() => toggleOffcanvas()}>
                    <i class="{offcanvas.open && !pinned ? "bi-x" : "bi-list"}"></i>
                    <span class="font-monospace">{title}</span>
                </button>
            </div>

            <div class="d-flex float-end">
                {#if user.isSigned}
                    <pre class="user-info text-nowrap" data-bs-toggle="tooltip" title="Current user">
                        {user.email}
                    </pre>
                    <a class="btn btn-sm btn-primary" href="{urls.logoutUrl}" data-bs-toggle="tooltip" title="Logout">
                        <i class="bi bi-box-arrow-right"></i>
                    </a>
                {:else}
                    <a class="btn btn-sm btn-primary" href="{urls.loginUrl}">
                        <i class="bi-person"></i>
                        Login
                    </a>
                {/if}
                <button class="btn btn-sm btn-primary mx-1" on:click={() => $isDarkTheme = !$isDarkTheme} data-bs-toggle="tooltip" title="{$isDarkTheme ? "Lights On" : "Lights Off"}">
                    <i class="{$isDarkTheme ? "bi-lightbulb" : "bi-lightbulb-off"}"></i>
                </button>
            </div>
        </div>
    </nav>
</header>

<main class:pinned-layout={pinned}>
    <div class="offcanvas-nav navbar-dark bg-primary" class:d-none={!pinned}>
        <div class="position-fixed pin-wrap">
            <button type="button" class="btn btn-sm btn-primary pin bi-pin" on:click={togglePin} data-bs-toggle="tooltip" title="Unpin sidebar"></button>
        </div>
        <ul class="navbar-nav navbar-dark flex-column mt-4 position-fixed">
            <Links />
        </ul>
    </div>
    <slot></slot>
</main>

<style lang="scss">
    @import "../../scss/variables";
    $sidebar-width: 290px;

    :global(body) {
        padding-top: 32px;
    }
    header {
        z-index: 1046;
    }
    :global(.offcanvas-nav) {
        width: $sidebar-width !important;
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
        border-left: solid 3px rgba($white, .55);
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
        top: 50px;
        right: 10px;
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
    .user-info {
        margin: auto;
        margin-right: 10px;
        font-weight: 900;
        color: $gray-900;
        text-shadow: 0 0 6px $white;
        cursor: default;
    }
</style>