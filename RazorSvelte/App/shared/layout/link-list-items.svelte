<script lang="ts">
    import { urls } from "../config";
</script>

<li class="nav-item py-0">
    <a class="nav-link " class:active={document.location.pathname == urls.indexUrl} href="{urls.indexUrl}">Home</a>
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
