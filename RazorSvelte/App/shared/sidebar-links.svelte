<script lang="ts">
    import urls from "./urls";
    export { classes as class };
    export let anchorClass = "nav-link";
    let classes: string = "nav-item";
</script>

<ul class="navbar-nav">
    <li class={classes} class:active={document.location.pathname == urls.indexUrl}>
        <a class={anchorClass} href={urls.indexUrl}>Home</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.authorizedUrl}>
        <a class={anchorClass} href={urls.authorizedUrl}>Authorized Access</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.cardDemoUrl}>
        <a class={anchorClass} href={urls.cardDemoUrl}>Card Component Demo</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.chartDemoUrl}>
        <a class={anchorClass} href={urls.chartDemoUrl}>Chart Components Demo</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.dataTableUrl}>
        <a class={anchorClass} href={urls.dataTableUrl}>DataTable Components Demo</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.spaUrl}>
        <a class={anchorClass} href={urls.spaUrl}>Spa Example</a>
    </li>
    <li class={classes} class:active={document.location.pathname == urls.formsDemoUrl}>
        <a class={anchorClass} href={urls.formsDemoUrl}>FormsDemo</a>
    </li>
</ul>

<style lang="scss">
    li {
        cursor: pointer;
    }
</style>
