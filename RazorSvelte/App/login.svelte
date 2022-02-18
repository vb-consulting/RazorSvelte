<script>
    import Button, { Label } from '@smui/button';
    import Layout from "./Shared/Layout.svelte";
    import urls from "./Shared/Urls";
</script>

<Layout>
    <div class="buttons">
        <div>
            <Button color="primary" variant="raised" href="{urls.signInGoogleUrl}">
                <Label>Login With Google</Label>
            </Button>
        </div>
        <div>
            <Button color="primary" variant="raised" href="{urls.signInLinkedInUrl}">
                <Label>Login With LinkedIn</Label>
            </Button>
        </div>
        <div>
            <Button color="primary" variant="raised" href="{urls.signInGitHubUrl}">
                <Label>Login With GitHub</Label>
            </Button>
        </div>
    </div>
</Layout>

<style lang="scss">
    .buttons {
        text-align: center;
        & > div {
            margin-bottom: 25px;
        }
    }
</style>
