<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import urls from "$shared/urls";

    import DataTable from "$data/data-table.svelte";
    import { get } from "$lib/fetch";

    const getCountries = () =>
        get<ICountry[]>(urls.countriesUrl, { "culture-contains": "en", limit: 5 });

    const getCountriesWithDelay = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return get<ICountry[]>(urls.countriesUrl, { "culture-contains": "fr", limit: 5 });
    };
</script>

<Layout>
    <div class="container text-center">
        <h3>DataTable Component Demo</h3>
        <p>
            DataTable Component is implemenation of <a
                href="https://getbootstrap.com/docs/5.3/content/tables/">bootstrap tables</a>
        </p>

        <DataTable
            dataFunc={getCountries}
            hover
            small
            striped
            caption="Top 5 English Speaking Countries"
            headers={true}>
            <tr slot="row" let:index let:data>
                <td>{index + 1} - {data.name}</td>
                <td>{data.code}</td>
                <td>{data.iso2}</td>
                <td>{data.iso3}</td>
                <td>{data.culture}</td>
                <td>{data.timestamp}</td>
            </tr>
        </DataTable>

        <DataTable
            dataFunc={getCountriesWithDelay}
            hover
            small
            caption="Top 5 French Speaking Countries - simulate slow loading with 1 second delay to show placeholder"
            headers={["Id", "Country", "Code", "Iso2 Code", "Iso3 Code", "Culture", "Timestamp"]}>
            <tr slot="row" let:index let:data>
                <th scope="row">{index + 1}</th>
                <td>{data.name}</td>
                <td>{data.code}</td>
                <td>{data.iso2}</td>
                <td>{data.iso3}</td>
                <td>{data.culture}</td>
                <td>{data.timestamp}</td>
            </tr>
            <tr slot="bottomRow" let:instance>
                <td colspan="999999" class="text-center">
                    <button class="btn btn-primary btn-sm" on:click={() => instance.refresh()}
                        >Load again</button>
                </td>
            </tr>
        </DataTable>

        <DataTable
            dataFunc={getCountries}
            hover
            small
            readBehavior="custom"
            headers={["Id", "Country", "Code", "Iso2 Code", "Iso3 Code", "Culture", "Timestamp"]}>
            <svelte:fragment slot="caption" let:instance>
                Click on this button to load data manually
                <button class="btn btn-primary btn-sm" on:click={() => instance.refresh()}
                    >Load</button>
            </svelte:fragment>
            <tr slot="row" let:index let:data>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.code}</td>
                <td>{data.iso2}</td>
                <td>{data.iso3}</td>
                <td>{data.culture}</td>
                <td>{data.timestamp}</td>
            </tr>
        </DataTable>
    </div>
</Layout>

<style lang="scss">
</style>
