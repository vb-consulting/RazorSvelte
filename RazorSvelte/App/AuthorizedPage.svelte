<script lang="ts">
    import Layout from "./Shared/Layout.svelte";
    import { UnorderedList, ListItem, } from "carbon-components-svelte";
    import { getFromJson } from "./Shared/config";

    let user = getFromJson<{name: string, email: string, timezone: string, timestamp: string}>("user");
</script>

<Layout>
    <div class="bx--content bx--toast-notification--info">
        <h1>Authorized Access Page</h1>
        
        <UnorderedList expressive>
            <ListItem>Name: {user.name}</ListItem>
            <ListItem>Email: {user.email}</ListItem>
            <ListItem>Timezone: {user.timezone}</ListItem>
            <ListItem>Timestamp: {user.timestamp}</ListItem>
        </UnorderedList>
    </div>
</Layout>
