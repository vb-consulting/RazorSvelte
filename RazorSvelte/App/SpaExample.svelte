<script lang="ts">
    import Paper, { Title, Content } from '@smui/paper';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    import Layout from "./Shared/Layout.svelte";
    import Router from "svelte-spa-router";
    import Home from "./SpaViews/Home.svelte";
    import About from "./SpaViews/About.svelte";
    import Parametrized from "./SpaViews/Parametrized.svelte";
    import Unknown from "./SpaViews/Unknown.svelte";
</script>

<Layout>
    <Paper color="primary" variant="outlined" style="margin-top: 25px">
        <Title>SPA (Single Page Application) Example</Title>
        <Content>
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
        </Content>
    </Paper>

    <TabBar tabs={[
        {name: "Home", url: "#"}, 
        {name: "About", url: "#/about"},
        {name: "Parametrized with AAA", url: "#/parametrized/AAA"},
        {name: "Parametrized with AAA", url: "#/parametrized/BBB"},
        {name: "Unknown route test", url: "#/test"}
    ]} let:tab>
        <Tab {tab} minWidth href="{tab.url}">
            <Label>{tab.name}</Label>
        </Tab>
    </TabBar>

    <div class="p-0 mt-5">
        <Router routes={{
            "/": Home,
            "/about": About,
            "/parametrized/:param": Parametrized,
            "*": Unknown,
        }} />
    </div>
</Layout>

