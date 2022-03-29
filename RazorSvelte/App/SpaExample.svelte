<script lang="ts">
    import Layout from "./shared/layout.svelte";
    import { Tile, Tabs, Tab } from "carbon-components-svelte";
    

    import Router from "svelte-spa-router";
    import Home from "./spaViews/home.svelte";
    import About from "./spaViews/about.svelte";
    import Parametrized from "./spaViews/parametrized.svelte";
    import Unknown from "./spaViews/unknown.svelte";
</script>

<Layout>
    <Tile>
        <h1>SPA (Single Page Application) Example</h1>
        <p>
            Single Page Application or SPA have page router on the client, rather then on server.
        </p>
        <p>
            This example uses svelte component called <code style="font-weight: bold;">svelte-spa-router</code> 
            that implements client-side router by using hashtags.
            You can use any other client router implementation or library or implement it youserlf it is not that hard.
        </p>
        <p>
            <a href="https://www.npmjs.com/package/svelte-spa-router">svelte-spa-router GitHub</a>
        </p>
        <p>
            <a class="" href="https://svelte.dev/repl/6e7546119cff41fabe35df3ef999ff7e?version=3.29.4">svelte-spa-router REPL</a>
        </p>
        <p>
            Bellow is implement where each SPA view or page is inside each tab component.
        </p>
    </Tile>

    <br />

    <Tabs autoWidth>
        <Tab label="Home" on:click={() => document.location = "#"} />
        <Tab label="About" on:click={() => document.location = "#/about"} />
        <Tab label="Parametrized with AAA" on:click={() => document.location = "#/parametrized/AAA"} />
        <Tab label="Parametrized with BBB" on:click={() => document.location = "#/parametrized/BBB"} />
        <Tab label="Unknown route test" on:click={() => document.location = "#/test"} />
    </Tabs>

    <Router routes={{
        "/": Home,
        "/about": About,
        "/parametrized/:param": Parametrized,
        "*": Unknown,
    }} />
</Layout>

