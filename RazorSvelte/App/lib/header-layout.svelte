<script lang="ts">
    import "bootstrap/js/dist/collapse";
    import { afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "./tooltips";
    import { isDarkTheme } from "./theme";
    import { user, title as configTitle, indexUrl, logoutUrl, loginUrl } from "./_config";

    export let title: string | undefined = undefined;

    if (!title) {
        title = configTitle;
    }

    interface $$Slots {
        default: { };
        links: { };
    }

    beforeUpdate(hideTooltips);
    afterUpdate(createTooltips);
</script>

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0">
        <div class="container-fluid">

            <a class="navbar-brand" href="{indexUrl}">{title}</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <i class="material-icons-outlined">menu</i> 
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto">
                    <slot name="links"></slot>
                </ul>
                <div class="d-flex float-end">
                    {#if user.isSigned}
                        <pre class="user-info text-nowrap">
                            {user.name}
                        </pre>
                        <a class="btn btn-primary" href="{logoutUrl}">
                            <i class="material-icons-outlined">logout</i>
                            Logout
                        </a>
                    {:else}
                        <a class="btn btn-sm btn-primary" href="{loginUrl}">
                            <i class="material-icons-outlined">login</i> 
                            Login
                        </a>
                    {/if}
                    <button class="btn btn-sm btn-primary mx-1" on:click={() => $isDarkTheme = !$isDarkTheme} data-bs-toggle="tooltip" title="{$isDarkTheme ? "Lights On" : "Lights Off"}">
                        <i class="material-icons-outlined">{$isDarkTheme ? "light_mode" : "dark_mode"}</i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</header>

<main>
    <slot></slot>
</main>

<style lang="scss">
    @import "../scss/variables";

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
    .user-info {
        color: $info;
        font-size: 0.8rem;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5px;
    }
</style>