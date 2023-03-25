<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import Card from "$area/card.svelte";
    import { themes } from "$lib/theme";
    import TextInput from "$forms/text-input.svelte";
    import Radio from "$forms/radio-input.svelte";

    export let user: IUser;
    export let theme: ThemesType;

    $: console.log(user.name);
    $: console.log(theme);
</script>

<Layout>
    <div class="container mt-5">
        <Card class="border">
            <TextInput label="Name" bind:value={user.name} large />
            <TextInput label="Email Address" class="mt-3" type="email" bind:value={user.email} />
            <Radio class="mt-3" radios={themes} inline bind:value={theme} />
        </Card>
    </div>
</Layout>

<style lang="scss">
</style>
