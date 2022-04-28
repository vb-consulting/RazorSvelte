<script lang="ts">
    import "bootstrap/js/dist/collapse";
    import { get, getBool } from "../config";
    import urls from "../urls";
    import { isDarkTheme } from "./theme";
    
    const user = {
        isSigned: getBool("isSigned"), 
        email: get<string>("email"),
    };
</script>

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0">
        <div class="container-fluid">

            <a class="navbar-brand" href="{urls.indexUrl}">RazorSvelte</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi-list"></i>
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item py-0">
                        <a class="nav-link " class:active={document.location.pathname == urls.indexUrl} href="{urls.indexUrl}">Home</a>
                    </li>
                    <li class="nav-item py-0">
                        <a class="nav-link" class:active={document.location.pathname == urls.offcanvasNavUrl} href="{urls.offcanvasNavUrl}">Offcanvas Navigation</a>
                    </li>
                    <li class="nav-item py-0">
                        <a class="nav-link" class:active={document.location.pathname == urls.privacyUrl} href="{urls.privacyUrl}">Privacy</a>
                    </li>
                    <li class="nav-item py-0">
                        <a class="nav-link" class:active={document.location.pathname == urls.authorizedUrl} href="{urls.authorizedUrl}">Authorized Access</a>
                    </li>
                    <li class="nav-item py-0">
                        <a class="nav-link" class:active={document.location.pathname == urls.spaUrl} href="{urls.spaUrl}">Spa Example</a>
                    </li>
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
                    <button class="btn btn-sm btn-primary mx-1" on:click={() => $isDarkTheme = !$isDarkTheme}>
                        <i class="{$isDarkTheme ? "bi-lightbulb" : "bi-lightbulb-off"}"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</header>

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

    @import "../../scss/colors";
    .user-info {
        color: $info;
        font-size: 0.8rem;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5px;
    }
</style>