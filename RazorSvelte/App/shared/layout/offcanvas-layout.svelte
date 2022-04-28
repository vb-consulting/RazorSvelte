<script lang="ts">
    import Offcanvas from "../components/offcanvas.svelte";
    import Footer from "./footer.svelte";
    import { get, getBool } from "../config";
    import urls from "../urls";
    import { isDarkTheme } from "./theme";
    
    const user = {
        isSigned: getBool("isSigned"), 
        email: get<string>("email"),
    };

    let offcanvas = {open: false};
</script>

{#if !offcanvas.open}
<div class="gutter bg-primary" on:focus={() => {offcanvas.open = true}} on:mouseover={() => {offcanvas.open = true}}></div>
{/if}

<Offcanvas state={offcanvas} classes="offcanvas-nav navbar-dark bg-primary" on:hidden={() => {offcanvas.open = false}}>
    <ul class="navbar-nav navbar-dark flex-column mt-4">
        <li class="nav-item" class:active={document.location.pathname == urls.indexUrl}>
            <a class="nav-link " class:active={document.location.pathname == urls.indexUrl} href="{urls.indexUrl}">Home</a>
        </li>
        <li class="nav-item" class:active={document.location.pathname == urls.offcanvasNavUrl}>
            <a class="nav-link" class:active={document.location.pathname == urls.offcanvasNavUrl} href="{urls.offcanvasNavUrl}">Offcanvas Navigation</a>
        </li>
        <li class="nav-item" class:active={document.location.pathname == urls.privacyUrl}>
            <a class="nav-link" class:active={document.location.pathname == urls.privacyUrl} href="{urls.privacyUrl}">Privacy</a>
        </li>
        <li class="nav-item" class:active={document.location.pathname == urls.authorizedUrl}>
            <a class="nav-link" class:active={document.location.pathname == urls.authorizedUrl} href="{urls.authorizedUrl}">Authorized Access</a>
        </li>
        <li class="nav-item" class:active={document.location.pathname == urls.spaUrl}>
            <a class="nav-link" class:active={document.location.pathname == urls.spaUrl} href="{urls.spaUrl}">Spa Example</a>
        </li>
    </ul>
</Offcanvas>

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0">
        <div class="container-fluid">
            <div class="d-flex float-start">
                <button class="btn btn-primary btn-lg" on:click={() => offcanvas.open = !offcanvas.open}>
                    <i class="{offcanvas.open ? "bi-x" : "bi-list"}"></i>
                </button>
            </div>

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
                <button class="btn btn-sm btn-primary mx-1" on:click={() => $isDarkTheme = !$isDarkTheme}>
                    <i class="{$isDarkTheme ? "bi-lightbulb" : "bi-lightbulb-off"}"></i>
                </button>
            </div>
        </div>
    </nav>
</header>

<main>
    <slot></slot>
</main>
<Footer />

<style lang="scss">
    @import "../../scss/colors";

    :global(body) {
        padding-top: 32px;
    }
    header {
        z-index: 1046;
    }
    :global(.offcanvas-nav) {
        width: auto;
        padding: 0;
    }
    :global(.offcanvas-nav > .offcanvas-body) {
        padding: 1rem 0;
    }
    :global(.offcanvas-nav .nav-item) {
        padding-left: 1rem;
        padding-right: 3rem;
    }
    :global(.offcanvas-nav .nav-item) {
        border-left: solid 3px transparent;
    }
    :global(.offcanvas-nav .nav-item.active) {
        border-left: solid 3px $white;
    }
    :global(.offcanvas-nav .nav-item:hover:not(.active)) {
        border-left: solid 3px rgba($white, .55);
    }

    .gutter {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 2px;
    }
</style>