<script lang="ts">
    import Header from "../app/Header.svelte";
    import Footer from "../app/Footer.svelte";
    import { getFromJson } from "../app/hidden-values";
    let user = getFromJson<{name: string, email: string, timezone: string, timestamp: string}>("user");
</script>

<Header />
<main>
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
</main>
<Footer />

