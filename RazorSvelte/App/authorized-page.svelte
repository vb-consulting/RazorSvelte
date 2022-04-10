<script lang="ts">
    import Layout from "./shared/layout/main.svelte";
    import { getFromJson } from "./shared/config";

    let user = getFromJson<{name: string, email: string, timezone: string, timestamp: string}>("user");
</script>

<Layout>
    <div class="container text-center m-5">
        <h1>Authorized Access Page</h1>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                Name: {user.name}
            </li>
            <li class="list-group-item">
                Email: {user.email}
            </li>
            <li class="list-group-item">
                Timezone: {user.timezone}
            </li>
            <li class="list-group-item">
                Timestamp: {user.timestamp}
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
    :global(main) {
        margin: auto;
    }
</style>
    