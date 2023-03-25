<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import Tabs from "$area/tabs.svelte";
    import Router from "svelte-spa-router";
    import Home from "./spa-views/home.svelte";
    import About from "./spa-views/about.svelte";
    import Parametrized from "./spa-views/parametrized.svelte";
    import Unknown from "./spa-views/unknown.svelte";

    let hash = document.location.hash;
    window.onhashchange = () => (hash = document.location.hash);
</script>

<Layout>
    <div class="container">
        <h3>Spa Example</h3>
        <p>
            This is an example of the Single-Page App (SPA) by using
            <a class="btn-link" href="https://www.npmjs.com/package/svelte-spa-router"
                >svelte-spa-router</a> component.
        </p>
        <p>
            See <a
                class="btn-link"
                href="https://svelte.dev/repl/6e7546119cff41fabe35df3ef999ff7e?version=3.29.4"
                >REPL</a>
            and/or
            <a class="btn-link" href="https://github.com/ItalyPaleAle/svelte-spa-router">GitHub</a> for
            this component.
        </p>

        <Tabs
            tabs={[
                { text: "Home", href: "#" },
                { text: "About", href: "#/about" },
                { text: "Parametrized with 'AAA'", href: "#/parametrized/AAA" },
                { text: "Parametrized with 'BBB'", href: "#/parametrized/BBB" },
                { text: "Unknown route", href: "#/test" }
            ]} />

        <div class="p-0 mt-3">
            <Router
                routes={{
                    "/": Home,
                    "/about": About,
                    "/parametrized/:param": Parametrized,
                    "*": Unknown
                    //'/blog/:blogName': Blog
                }} />
        </div>
    </div>
</Layout>
