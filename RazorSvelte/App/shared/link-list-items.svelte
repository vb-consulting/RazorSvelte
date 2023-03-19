<script lang="ts">
    import urls from "./urls";
    export { classes as class };
    export let anchorClass = "nav-link";
    let classes: string = "nav-item py-0";
</script>

<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.indexUrl}
        href={urls.indexUrl}>Home</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.authorizedUrl}
        href={urls.authorizedUrl}>Authorized Access</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.spaUrl}
        href={urls.spaUrl}>Spa Example</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.cardDemoUrl}
        href={urls.cardDemoUrl}>Card Component Demo</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.chartDemoUrl}
        href={urls.chartDemoUrl}>Chart Components Demo</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.dataTableUrl}
        href={urls.dataTableUrl}>DataTable Components Demo</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.fileSelectorUrl}
        href={urls.fileSelectorUrl}>FileSelector</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.modalUrl}
        href={urls.modalUrl}>Modal</a>
</li>
<li class={classes}>
    <a
        class={anchorClass}
        class:active={document.location.pathname == urls.multiselectUrl}
        href={urls.multiselectUrl}>Multiselect</a>
</li>
