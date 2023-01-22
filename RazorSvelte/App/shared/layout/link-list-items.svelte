<script lang="ts">
    import urls from "../urls";
</script>

<li class="nav-item py-0">
    <a class="nav-link " class:active={document.location.pathname == urls.indexUrl} href="{urls.indexUrl}">Home</a>
</li>
<li class="nav-item py-0">
    <a class="nav-link" class:active={document.location.pathname == urls.authorizedUrl} href="{urls.authorizedUrl}">Authorized Access</a>
</li>
<li class="nav-item py-0">
    <a class="nav-link" class:active={document.location.pathname == urls.spaUrl} href="{urls.spaUrl}">Spa Example</a>
</li>
<li class="nav-item py-0">
    <a class="nav-link" class:active={document.location.pathname == urls.cardDemoUrl} href="{urls.cardDemoUrl}">CardDemo</a>
</li>
<li class="nav-item py-0">
    <a class="nav-link" class:active={document.location.pathname == urls.chartDemoUrl} href="{urls.chartDemoUrl}">ChartDemo</a>
</li>