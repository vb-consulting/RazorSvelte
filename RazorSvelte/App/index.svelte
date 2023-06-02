<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import Card from "$area/card.svelte";

    import LinkListItems from "$shared/sidebar-links.svelte";

    export let user: IUser;
    export let theme: string;

    let selectionValue: string = "";
    let selectionElement: HTMLSelectElement;

    $: selectedText = selectionValue
        ? selectionElement.options[selectionElement.selectedIndex].innerText
        : "";
</script>

<Layout>
    <div class="container">
        <h1 class="text-center text-primary">Hello World from Svelte, Boostrap and Razor</h1>

        <h2 class="text-center text-primary">
            {#if user.isSigned}
                Welcome {user.name}!
            {:else}
                Welcome unknown user!
            {/if}
            How you like the {theme} theme?
        </h2>

        <Card class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Select What Do You Want to Learn Today</div>
                <select
                    class="form-select form-select-lg mb-3"
                    bind:value={selectionValue}
                    bind:this={selectionElement}>
                    <option selected value="">Open this select menu</option>
                    <option value="https://docs.microsoft.com/aspnet/core"
                        >Building Web apps with ASP.NET Core</option>
                    <option value="https://svelte.dev/"
                        >SVELTE: CYBERNETICALLY ENHANCED WEB APPS</option>
                    <option value="https://svelte.dev/tutorial/basics">Svlete Tutorial</option>
                    <option value="https://getbootstrap.com/docs/">Bootstrap</option>
                    <option value="https://sass-lang.com/guide">SASS and SCSS Languague</option>
                </select>
                {#if selectionValue}
                    <a
                        class="btn btn-primary"
                        href={selectionValue}
                        target="_blank"
                        rel="noreferrer">{selectedText}</a>
                {/if}
            </div>
        </Card>

        <Card class="shadow-lg card mt-3">
            <LinkListItems class="list-group-item" />
        </Card>
    </div>
</Layout>

<style lang="scss">
</style>
