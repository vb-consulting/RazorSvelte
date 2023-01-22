<script lang="ts">
    import Layout from "./shared/layout/default";
    import Card from "./lib/card.svelte";
</script>

<Layout>
    <div class="container">
        <h1>CardDemo</h1>
        
        <Card class="mt-3">
            Slot Content
        </Card>
        <Card class="mt-3 text-center">
            Slot Content Centered
        </Card>
        <Card class="mt-3" title="title">
            Card 2 Content
        </Card>
    </div>
</Layout>

<style lang="scss">
    .container {
        margin-top: 10%;
    }
</style> 
