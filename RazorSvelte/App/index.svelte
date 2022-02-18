<script lang="ts">
    import Paper, { Title, Content } from '@smui/paper';
    import Fab, { Label as FabLabel, Icon as FabIcon } from '@smui/fab';
    import Select, { Option } from '@smui/select';
    import Icon from '@smui/select/icon';
    import DataTable, {Head, Body, Row, Cell, Pagination} from '@smui/data-table';
    import IconButton from '@smui/icon-button';
    import { Label } from '@smui/common';

    import Layout from "./Shared/Layout.svelte";
    
    export let name: string;
    let value: {name: string, url: string};
    let items = [
        {name: "ASP.NET", url: "https://docs.microsoft.com/aspnet/"},
        {name: ".NET", url: "https://docs.microsoft.com/dotnet/"},
        {name: "C#", url: "https://docs.microsoft.com/en-us/learn/paths/build-dotnet-applications-csharp/"},
        {name: "Svelte", url: "https://svelte.dev/"},
        {name: "Svelte Tutorial", url: "https://svelte.dev/tutorial/basics"},
        {name: "Svelte Material UI", url: "https://sveltematerialui.com/"},
        {name: "Typescript", url: "https://www.typescriptlang.org/"},
        {name: "SASS", url: "https://sass-lang.com/guide"},
    ];

    type Todo = {
        id: number;
        title: string;
        completed: boolean;
        userId: number;
    };
    let todos: Todo[] = [];
    let rowsPerPage = 10;
    let currentPage = 0;

    $: start = currentPage * rowsPerPage;
    $: end = Math.min(start + rowsPerPage, todos.length);
    $: slice = todos.slice(start, end);
    $: lastPage = Math.max(Math.ceil(todos.length / rowsPerPage) - 1, 0);

    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    // Slice a few off the end to show how the
    // last page looks when it's not full.
    fetch("https://gist.githubusercontent.com/hperrin/e24a4ebd9afdf2a8c283338ae5160a62/raw/dcbf8e6382db49b0dcab70b22f56b1cc444f26d4/todos.json")
        .then((response) => response.json())
        .then((json) => (todos = json.slice(0, 197)));
</script>

<Layout>
    <div class="mdc-typography--body1">
        <div class="mdc-typography--headline4">{name}</div>

        <Paper color="primary" variant="outlined" style="margin-top: 25px">
            <Title>Choose what would you like to learn today</Title>
            <Content>
                <Select label="Please select" bind:value={value}  style="width: 25%">
                    <Icon class="material-icons" slot="leadingIcon">event</Icon>
                    <Option value="" />
                    {#each items as item}
                        <Option value={item}>{item.name}</Option>
                    {/each}
                </Select>
                <div>
                    {#if value}
                        <Fab color="primary" extended ripple href={value.url} target="_blank" style="margin-top: 25px">
                            <FabIcon class="material-icons">favorite</FabIcon>
                            <FabLabel>Click here to learn more about {value.name}</FabLabel>
                        </Fab>
                    {/if}
                </div>
            </Content>
        </Paper>

        <Paper color="primary" variant="outlined" style="margin-top: 25px">
            <Title>DataGrid Demonstration</Title>
            <Content>
                <DataTable table$aria-label="Todo list" style="width: 100%;">
                    <Head>
                        <Row>
                            <Cell numeric>ID</Cell>
                            <Cell style="width: 100%;">Title</Cell>
                            <Cell>Completed</Cell>
                            <Cell numeric>User ID</Cell>
                        </Row>
                    </Head>
                    <Body>
                        {#each slice as item (item.id)}
                            <Row>
                                <Cell numeric>{item.id}</Cell>
                                <Cell>{item.title}</Cell>
                                <Cell>{item.completed ? 'Yes' : 'No'}</Cell>
                                <Cell numeric>{item.userId}</Cell>
                            </Row>
                        {/each}
                    </Body>

                    <Pagination slot="paginate">
                        <svelte:fragment slot="rowsPerPage">
                            <Label>Rows Per Page</Label>
                            <Select variant="outlined" bind:value={rowsPerPage} noLabel>
                                <Option value={10}>10</Option>
                                <Option value={25}>25</Option>
                                <Option value={100}>100</Option>
                            </Select>
                        </svelte:fragment>
                        <svelte:fragment slot="total">
                            {start + 1}-{end} of {items.length}
                        </svelte:fragment>

                        <IconButton
                            class="material-icons"
                            action="first-page"
                            title="First page"
                            on:click={() => (currentPage = 0)}
                            disabled={currentPage === 0}>first_page</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="prev-page"
                            title="Prev page"
                            on:click={() => currentPage--}
                            disabled={currentPage === 0}>chevron_left</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="next-page"
                            title="Next page"
                            on:click={() => currentPage++}
                            disabled={currentPage === lastPage}>chevron_right</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="last-page"
                            title="Last page"
                            on:click={() => (currentPage = lastPage)}
                            disabled={currentPage === lastPage}>last_page</IconButton
                        >
                    </Pagination>
                </DataTable>

            </Content>
        </Paper>

    </div>
</Layout>

<style lang="scss">
    // needed for the mdc-typography-- classes, see https://sveltematerialui.com/demo/typography
    @use '@material/typography/mdc-typography';
</style>