<script lang="ts">
    import "bootstrap/js/dist/collapse";
    import { afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "../../lib/tooltips";
    import { user, title as configTitle } from "../config";
    import urls from "../urls";
    import { isDarkTheme } from "./theme";
    import Footer from "./footer.svelte";
    import Links from "./link-list-items.svelte";

    export let title: string = configTitle;
    
    beforeUpdate(hideTooltips);
    afterUpdate(createTooltips);
</script>

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0">
        <div class="container-fluid">

            <a class="navbar-brand" href="{urls.indexUrl}">{title}</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi-list"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto">
                    <Links />
                </ul>
                <div class="d-flex float-end">
                    {#if user.isSigned}
                        <pre class="user-info text-nowrap">
                            {user.email}
                        </pre>
                        <a class="btn btn-primary" href="{urls.logoutUrl}">
                            <i class="bi bi-box-arrow-right"></i>
                            Logout
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
        </div>
    </nav>
</header>

<main>
    <slot></slot>
</main>
<Footer />

<style lang="scss">
    :global(body) {
        padding-top: 32px;
    }
    .navbar {
        font-size: 0.9em;
    }
    .navbar-brand {
        font-size: 1em;
    }
    @media (max-width: 768px) {
        .collapse.navbar-collapse:global(.show) {
            padding-bottom: 5px;
        }
    }

    @import "../../scss/variables";
    .user-info {
        color: $info;
        font-size: 0.8rem;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5px;
    }
</style>