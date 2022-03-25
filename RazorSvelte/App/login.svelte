<script>
    import Layout from "./Shared/Layout.svelte";
    import urls from "./Shared/Urls";
    import { ButtonSet, Button } from "carbon-components-svelte";
    import Login16 from "carbon-icons-svelte/lib/Login16";
</script>

<Layout>
    <ButtonSet stacked>
        <Button kind="ghost" icon={Login16} href="{urls.signInGoogleUrl}">Login With Google</Button>
        <Button kind="ghost" icon={Login16} href="{urls.signInLinkedInUrl}">Login With LinkedIn</Button>
        <Button kind="ghost" icon={Login16} href="{urls.signInGitHubUrl}">Login With GitHub</Button>
    </ButtonSet>
</Layout>
