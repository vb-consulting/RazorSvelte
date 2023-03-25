<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import Card from "$area/card.svelte";
</script>

<Layout>
    <div class="container">
        <h1>Card Component Demo</h1>

        <Card class="mt-3 text-center" text="Content from Prop" />

        <Card class="mt-3 text-center">Content from Slot</Card>

        <Card class="mt-3" title="title" footer="footer" subtitle="subtitle" label="label">
            Content from Slot
        </Card>

        <Card
            class="mt-3"
            title="title"
            footer="footer"
            subtitle="subtitle"
            label="label"
            text="Content from Prop">
            <div>Content from Slot</div>
            <div slot="title">title slot</div>
            <div slot="footer">footer slot</div>
            <div slot="subtitle">subtitle slot</div>
            <span slot="label">label slot</span>
        </Card>
    </div>
</Layout>

<style lang="scss">
</style>
