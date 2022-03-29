<script lang="ts">
    import Layout from "./shared/layout.svelte";
    import urls from "./shared/urls";
    import { Button } from "carbon-components-svelte";
</script>

<Layout>

    <div class="bx--content bx--toast-notification--error">
        <h1 class="">401 Unathorized Access</h1>
        <p>
            You might want to login by using the login page.
        </p>
        <br />
        <Button href={urls.loginUrl}>Click Here to Login</Button>
    </div>
</Layout>
