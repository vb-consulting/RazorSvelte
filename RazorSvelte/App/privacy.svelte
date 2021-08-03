<script lang="ts">
    import Header from "./shared/Header.svelte";
    import Footer from "./shared/Footer.svelte";
    import { get } from "./shared/hidden-values";
    let title = get<string>("title");
</script>

<Header />
<main>
    <div class="container">
        <h1>{title}</h1>
        <p>Use this page to detail your site's privacy policy.</p>
    </div>
</main>
<Footer />

