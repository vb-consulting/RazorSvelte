<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import Card from "$area/card.svelte";
    import FileSelector from "$forms/file-selector.svelte";
    import MultiSelect from "$forms/multi-select.svelte";

    import urls from "$shared/urls";
    import { get } from "$lib/fetch";

    let fileSelector: IFileSelector;
    let file: File;

    let selectedFruits = [1, 2];

    const searchCountries = async (request: { search: string; skip: number; take: number }) => {
        const response = await get<{ count: number; page: ICountry[] }>(
            urls.searchCountriesUrl,
            request
        );
        return {
            count: response.count,
            page: response.page.map((x) => ({ value: x.code, name: x.name }))
        };
    };

    $: {
        console.log(selectedFruits);
    }
</script>

<Layout>
    <div class="container text-center">
        <h1>Forms Demo</h1>

        <Card label="file-selector">
            <FileSelector style="" bind:file bind:instance={fileSelector}>
                drop file here or <button
                    class="btn btn-sm btn-link"
                    on:click={() => fileSelector.open()}>click here</button>
                to select manually
                <br />
                selected file:
                <p>{file?.name}</p>
            </FileSelector>
        </Card>

        <Card label="multi-select" class="mt-3">
            <MultiSelect
                placeholder="Single values"
                values={["apple", "bannana", "orange", "mango", "melons", "peaches"]}
                selectedKeys={["apple", "bannana"]}
                on:change={(e) => console.log(e.detail.keys)} />

            <MultiSelect
                tokenColorTheme="secondary"
                placeholder="Value-name pair values"
                class="mt-3"
                bind:selectedKeys={selectedFruits}
                options={[
                    { value: 1, name: "apple" },
                    { value: 2, name: "bannana" },
                    { value: 3, name: "orange" },
                    { value: 4, name: "mango" },
                    { value: 5, name: "melons" },
                    { value: 6, name: "peaches " }
                ]} />

            <MultiSelect
                tokenColorTheme="success"
                placeholder="Search remote"
                class="mt-3"
                searchFunc={searchCountries} />
        </Card>
    </div>
</Layout>

<style lang="scss">
</style>
