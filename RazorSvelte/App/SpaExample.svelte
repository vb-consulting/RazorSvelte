<script lang="ts">
    import Layout from "./shared/Layout.svelte";
    import Router from "svelte-spa-router";
    import Home from "./spa-views/Home.svelte";
    import About from "./spa-views/About.svelte";
    import Parametrized from "./spa-views/Parametrized.svelte";
    import Unknown from "./spa-views/Unknown.svelte";
</script>

<Layout>
    <div class="container">
        <h1>Spa Example</h1>
        <p>
            This is an example of the Single-Page App (SPA) by using 
            <a class="btn btn-link" href="https://www.npmjs.com/package/svelte-spa-router"><code>svelte-spa-router</code></a> component.
            <br />
            See <a class="" href="https://svelte.dev/repl/6e7546119cff41fabe35df3ef999ff7e?version=3.29.4">REPL</a> and/or 
            <a class="" href="https://github.com/ItalyPaleAle/svelte-spa-router">GitHub</a> for this component.
        </p>

        <div class="container p-0">

            <ul class="nav justify-content-center border">
                <li class="nav-item">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/parametrized/AAA">Parametrized with "AAA"</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/parametrized/BBB">Parametrized with "BBB"</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/test">Unknown route</a>
                </li>
            </ul>

            <div class="p-0 mt-5">
                <Router routes={{
                    "/": Home,
                    "/about": About,
                    "/parametrized/:param": Parametrized,
                    "*": Unknown,
                    //'/blog/:blogName': Blog
                }} />
            </div>
        </div>
    </div>
</Layout>

