<script lang="ts">
import Layout from "./shared/layout.svelte";
import { 
    Select, 
    SelectItem, 
    
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    Pagination,

    Button } from "carbon-components-svelte";

let items = [
        {name: "ASP.NET", url: "https://docs.microsoft.com/aspnet/"},
        {name: ".NET", url: "https://docs.microsoft.com/dotnet/"},
        {name: "C#", url: "https://docs.microsoft.com/en-us/learn/paths/build-dotnet-applications-csharp/"},
        {name: "Svelte", url: "https://svelte.dev/"},
        {name: "Svelte Tutorial", url: "https://svelte.dev/tutorial/basics"},        
        {name: "Svelte Carbon Components", url: "https://carbon-components-svelte.onrender.com/"},
        {name: "Svelte Carbon Components Source", url: "https://github.com/carbon-design-system/carbon-components-svelte"},
        {name: "Svelte Carbon Components Icons", url: "https://github.com/carbon-design-system/carbon-icons-svelte"},
        {name: "Carbon Charts", url: "https://github.com/carbon-design-system/carbon-charts"},
        {name: "Carbon Design System", url: "https://www.carbondesignsystem.com/"},
        {name: "Typescript", url: "https://www.typescriptlang.org/"},
        {name: "SASS", url: "https://sass-lang.com/guide"},
];

let selected = "5";

let rows = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: "Load Balancer " + (i + 1),
    protocol: "HTTP",
    port: 3000 + i * 10,
    rule: i % 2 ? "Round robin" : "DNS delegation",
}));

let pagination = {pageSize: 10, page: 0}
</script>

<Layout>
    <Select inline light labelText="Choose what would you like to learn today" bind:selected>
        {#each items as item, i}
            <SelectItem value={i.toString()} text={item.name}></SelectItem>
        {/each}
    </Select>

    <Button href="{items[Number(selected)].url}" target="_target">
        Learn about {items[Number(selected)].name}
    </Button>

    <br />
    <br />
    <hr />
    <br />

    <DataTable sortable title="Load balancers" description="Your organization's active load balancers."
        headers={[
            { key: "name", value: "Name" },
            { key: "protocol", value: "Protocol" },
            { key: "port", value: "Port" },
            { key: "rule", value: "Rule" },
        ]}
        pageSize={pagination.pageSize}
        page={pagination.page}
        {rows}>
        <Toolbar>
            <ToolbarContent>
                <ToolbarSearch persistent value="round" shouldFilterRows={(row, value) => {
                return (
                    /(6|8)$/.test(row.name) && row.rule.toLowerCase().includes(value.toString().toLowerCase())
                );}}
            />
            <ToolbarMenu>
                <ToolbarMenuItem primaryFocus>Restart all</ToolbarMenuItem>
                <ToolbarMenuItem href="https://cloud.ibm.com/docs/loadbalancer-service">
                    API documentation
                </ToolbarMenuItem>
                <ToolbarMenuItem hasDivider danger>Stop all</ToolbarMenuItem>
            </ToolbarMenu>
            <Button>Create balancer</Button>
            </ToolbarContent>
        </Toolbar>
    </DataTable>
    <Pagination
        bind:pageSize={pagination.pageSize}
        bind:page={pagination.page}
        totalItems={6}
        pageSizeInputDisabled
    />

</Layout>
