<script lang="ts">
    import { getAll, get } from "../config";
    import urls from "../urls";
    let user = getAll<{isSigned: Boolean, email: string, theme: string}>();

    let isDark = user.theme === "dark";
    function lightSwitchClick() {
        isDark = !isDark
        let d = new Date();
        d.setFullYear(d.getFullYear() + 10)
        if (!isDark) {
            document.body.classList.add("light");
            document.body.classList.remove("dark");
            document.cookie = `theme=light; expires=${d.toUTCString()}`;
        } else {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            document.cookie = `theme=dark; expires=${d.toUTCString()}`;
        }
    }

</script>

<header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
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
                            <a class="btn btn-primary" href="{urls.logoutUrl}">Logout</a>
                        </div>
                    {:else}
                        <a class="btn btn-primary" href="{urls.loginUrl}">
                            <i class="bi-person"></i>
                            Login
                        </a>
                    {/if}
                    <button class="btn btn-primary" on:click={lightSwitchClick}>
                        <i class="{isDark ? "bi-lightbulb" : "bi-lightbulb-off"}"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</header>

<style lang="scss">
    nav {
        height: 50px;
    }
</style>