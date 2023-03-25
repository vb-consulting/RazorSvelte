<script lang="ts">
    import Layout from "$shared/layout.svelte";
    export let user: IUser;
</script>

<Layout>
    <div class="container text-center m-5">
        <h1>Authorized Access Page</h1>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">
                Name: {user.name}
            </li>
        </ul>
    </div>
</Layout>

<style lang="scss">
</style>
