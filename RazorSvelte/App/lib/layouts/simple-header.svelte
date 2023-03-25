<script lang="ts">
    import "bootstrap/js/dist/collapse";
    import { afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "$element/tooltips";
    import UserMenu from "$layout/_user-menu.svelte";
    import DiminishingNav from "$layout/_diminishing-nav.svelte";
    import { title as configTitle } from "$lib/config";

    export let title: string | undefined = undefined;

    if (!title) {
        title = configTitle;
    }

    interface $$Slots {
        default: {};
        links: {};
    }

    let diminishNavClass: string;

    beforeUpdate(hideTooltips);
    afterUpdate(createTooltips);
</script>

<DiminishingNav bind:diminishNavClass />

<header>
    <nav
        class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0 {diminishNavClass}">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">{title}</a>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <i class="material-icons-outlined">menu</i>
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto">
                    <slot name="links" />
                </ul>
                <div class="d-flex float-end">
                    <UserMenu />
                </div>
            </div>
        </div>
    </nav>
</header>

<main>
    <slot />
</main>

<style lang="scss">
    @import "../scss/variables";
    @import "../scss/layout";

    :global(body) {
        padding-top: 32px;
    }
    .navbar {
        font-size: 0.9em;

        & .navbar-nav :global(.nav-item) {
            width: auto;
        }
        & .navbar-nav :global(.nav-link) {
            white-space: nowrap;
            max-width: 71px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .navbar-brand {
        font-size: 1em;
    }
    @media (max-width: 768px) {
        .collapse.navbar-collapse:global(.show) {
            padding-bottom: 5px;
        }
    }
</style>
