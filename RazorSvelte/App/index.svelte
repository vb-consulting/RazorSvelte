<script lang="ts">
    import Layout from "./shared/Layout.svelte";
    export let name: string;
</script>

<Layout>
    <div class="container text-center">
        <h1 class="display-4">
            Welcome {name}
        </h1>

        <p>
            Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.
        </p>
        <p>
            Learn about <a href="https://svelte.dev/">svelte</a>.
        </p>
        <p>
            Check out awesome <a href="https://svelte.dev/tutorial/basics">svelte tutorial</a>.
        </p>
        <p>
            See also <a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/">bootstrap documentation</a>.
        </p>
        <p>
            And, for better and easier css, you might also want to catch up on <a href="https://sass-lang.com/guide">scss and sass language</a>.
        </p>
    </div>
</Layout>

<style lang="scss">
    @import "../Styles/colors.scss";

    h1 {
        color: $primary;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    p {
        color: $info;
        & > a {
            color: $secondary;
        }
    }
</style>