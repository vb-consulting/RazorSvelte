<script lang="ts">
    import Layout from "./shared/layout/default";
    import Router from "svelte-spa-router";
    import Home from "./spa-views/home.svelte";
    import About from "./spa-views/about.svelte";
    import Parametrized from "./spa-views/parametrized.svelte";
    import Unknown from "./spa-views/unknown.svelte";

    let hash = document.location.hash;
    window.onhashchange = () => hash = document.location.hash;
</script>

<Layout>
    <div class="container mt-3">

        <h3>Spa Example</h3>
        <p>
            This is an example of the Single-Page App (SPA) by using 
            <a class="btn-link" href="https://www.npmjs.com/package/svelte-spa-router">svelte-spa-router</a> component.
        </p>
        <p>
            See <a class="btn-link" href="https://svelte.dev/repl/6e7546119cff41fabe35df3ef999ff7e?version=3.29.4">REPL</a> and/or 
            <a class="btn-link" href="https://github.com/ItalyPaleAle/svelte-spa-router">GitHub</a> for this component.
        </p>

        <ul class="nav nav-tabs">
            <li class="nav-item">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a class="nav-link" class:active={hash == ""} href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={hash == "#/about"} href="#/about">About</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={hash == "#/parametrized/AAA"} href="#/parametrized/AAA">Parametrized with "AAA"</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" class:active={hash == "#/parametrized/BBB"} href="#/parametrized/BBB">Parametrized with "BBB"</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#/test">Unknown route</a>
            </li>
        </ul>

        <div class="p-0 mt-3">
            <Router routes={{
                "/": Home,
                "/about": About,
                "/parametrized/:param": Parametrized,
                "*": Unknown,
                //'/blog/:blogName': Blog
            }} />
        </div>
    </div>
</Layout>

