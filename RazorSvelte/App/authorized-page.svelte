<script lang="ts">
    import Layout from "./shared/layout/default";
    import { user } from "./shared/config";
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
    .container {
        margin-top: 50px;
    }
</style>
    