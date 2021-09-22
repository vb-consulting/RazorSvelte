<script lang="ts">
    import { getAll } from "./config";
    import urls from "./urls";
    let user = getAll<{isSigned: Boolean, email: string}>();
</script>

<header>
    <nav class="navbar navbar-expand-md navbar-light fixed-top bg-light">
        <div class="container-fluid">
            
            <a class="navbar-brand" href="{urls.indexUrl}">RazorSvelte</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link active" href="{urls.indexUrl}">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{urls.privacyUrl}">Privacy</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{urls.authorizedUrl}">Authorized Access</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{urls.spaUrl}">Spa Example</a>
                    </li>
                </ul>
                <div class="d-flex">
                    {#if user.isSigned}
                        <div class="navbar-nav">
                            <div class="nav-item p-2">{user.email}</div>
                            <a class="btn btn-outline-success" href="{urls.logoutUrl}">Logout</a>
                        </div>
                    {:else}
                        <a class="btn btn-outline-success" href="{urls.loginUrl}">Login</a>
                    {/if}
                </div>
            </div>
        </div>
    </nav>
</header>