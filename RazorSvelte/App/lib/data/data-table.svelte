<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import Placeholder from "$area/placeholder.svelte";

    type T = $$Generic;

    interface $$Slots {
        /**
         * The row slot is used to define the row template.
         * Rendred for each data object in the data array.
         * Usually TR HTML element rendered inside table body.
         * The slot is passed the following properties:
         * data: The data object for the row.
         * index: The index of the row.
         * instance: The DataTable instance.
         */
        row: { data: T; index: number; instance: IDataTable };
        /**
         * The groupRow slot is used to define the group row template.
         * Rendred for each data object in the data group.
         * Usually TR HTML element rendered inside table body. The slot is passed the following properties:
         * key: The group key.
         * group: The group of data objects in array.
         * index: The index of the group.
         * instance: The DataTable instance.
         */
        groupRow: { key: string; group: T[]; index: number; instance: IDataTable };
        /**
         * The header slot is used to define the table header template rendered inside table caption element.
         * The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        caption: { instance: IDataTable };
        /**
         * The placeholderRow slot is used to define the placeholder row template.
         * Usually TR HTML element rendered inside table body when data is not loaded. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        placeholderRow: { instance: IDataTable };
        /**
         * The headerRow slot is used to define the table header row template.
         * Usually TR HTML element rendered inside table head element. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        headerRow: { instance: IDataTable };
        /**
         * The topRow slot is used to define the table top row template.
         * Usually TR HTML element rendered inside table head element. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        topRow: { instance: IDataTable };
        /**
         * The bottomRow slot is used to define the table bottom row template.
         * Usually TR HTML element rendered inside table head element. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        bottomRow: { instance: IDataTable };
        /**
         * The noResultsRow slot is used to define the table row template when data is empty.
         * Usually TR HTML element rendered inside table head element. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        noResultsRow: { instance: IDataTable };
        /**
         * The errorRow slot is used to define the table row template when data yielded error.
         * Usually TR HTML element rendered inside table head element. The slot is passed the following properties:
         * instance: The DataTable instance.
         */
        errorRow: { instance: IDataTable; error: any };
    }
    /**
     * The data function that returns a promise of data array.
     */
    export let dataFunc: (() => Promise<T[]>) | undefined = undefined;
    /**
     * The data function that returns a promise of data array in a group.
     */
    export let dataGroupFunc: (() => Promise<Record<string, T[]>>) | undefined = undefined;
    /**
     * The data function that returns a promise of data array in a page with count.
     */
    export let dataPageFunc:
        | ((instance: IDataTable) => Promise<{ count: number; page: T[] }>)
        | undefined = undefined;
    /**
     * primary variant
     */
    export let primary = false;
    /**
     * secondary variant
     */
    export let secondary = false;
    /**
     * success variant
     */
    export let success = false;
    /**
     * danger variant
     */
    export let danger = false;
    /**
     * warning variant
     */
    export let warning = false;
    /**
     * info variant
     */
    export let info = false;
    /**
     * light variant
     */
    export let light = false;
    /**
     * dark variant
     */
    export let dark = false;
    /**
     * striped variant
     */
    export let striped = false;
    /**
     * stripedColumns variant
     */
    export let stripedColumns = false;
    /**
     * hover variant
     */
    export let hover = false;
    /**
     * bordered variant
     */
    export let bordered = false;
    /**
     * borderless variant
     */
    export let borderless = false;
    /**
     * small variant
     */
    export let small = false;
    /**
     * responsive variant
     */
    export let responsive = false;
    /**
     * responsiveSm variant
     */
    export let responsiveSm = false;
    /**
     * responsiveMd variant
     */
    export let responsiveMd = false;
    /**
     * responsiveLg variant
     */
    export let responsiveLg = false;
    /**
     * responsiveXl variant
     */
    export let responsiveXl = false;
    /**
     * responsiveXxl variant
     */
    export let responsiveXxl = false;

    export let headers: boolean | string[] | IDataTableHeader[] = [];
    export let caption = "";
    export let headerGroupDivider = false;

    export let take: number = 50;
    export let readBehavior: LifeCycleType = "immediate";

    export let placeHolderHeight: string = "100px";

    export const instance: IDataTable = {
        initialized: false,
        working: false,
        skip: 0,
        count: 0,
        take,
        page: 0,
        pageCount: 0,
        error: null,
        setPage: async function (page: number) {
            if (page == 1) {
                this.skip = 0;
            } else {
                this.skip = (page - 1) * this.take;
            }
            await this.refresh();
        },
        refresh: async function () {
            if (dataFunc) {
                await readData();
            } else {
                await readDataPage();
            }
        }
    };
    /**
     * A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().
     */
    export { classes as class };
    /*
     * Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the style element have mainly the purpose of allowing for quick styling, for example for testing purposes.
     */
    export { styles as style };

    let classes: string = "";
    let styles: string = "";

    let data: T[];
    let group: Record<string, T[]>;
    let _headers: string[];

    const dispatch = createEventDispatcher();

    function instanceOfIDataTableHeader(value: any): value is IDataTableHeader {
        if (typeof value == "string") {
            return false;
        }
        return "text" in value;
    }

    async function readGroupData() {
        if (!dataGroupFunc || instance.working) {
            return;
        }
        dispatch("render", { instance: instance });
        instance.working = true;
        const result = await dataGroupFunc();
        instance.count = Object.keys(result).length;
        instance.working = false;
        if (!instance.initialized) {
            instance.initialized = true;
        }
        if (typeof headers == "boolean" && headers == true && result.length) {
            _headers = Object.keys(Object.values(result)[0] as any);
        }
        group = result;
        setTimeout(() => dispatch("rendered", { instance: instance, data: group }));
    }

    async function readData() {
        if (!dataFunc || instance.working) {
            return;
        }
        dispatch("render", { instance: instance });
        instance.working = true;
        const result = await dataFunc();
        instance.count = result.length;
        instance.working = false;
        if (!instance.initialized) {
            instance.initialized = true;
        }
        if (typeof headers == "boolean" && headers == true && result.length) {
            _headers = Object.keys(result[0] as any);
        }
        data = result;
        setTimeout(() => dispatch("rendered", { instance: instance, data }));
    }

    async function readDataPage() {
        if (!dataPageFunc || instance.working) {
            return;
        }
        dispatch("render", { instance: instance });
        instance.working = true;
        const result = await dataPageFunc(instance);
        instance.count = result.count;
        instance.page = instance.skip == 0 ? 1 : Math.round(instance.skip / instance.take) + 1;
        instance.pageCount = Math.ceil(instance.count / instance.take);
        instance.working = false;
        if (!instance.initialized) {
            instance.initialized = true;
        }
        if (typeof headers == "boolean" && headers == true && result.page.length) {
            _headers = Object.keys(result.page[0] as any);
        }
        data = result.page;
        setTimeout(() => dispatch("rendered", { instance: instance, data }));
    }

    async function read() {
        instance.error = null;
        try {
            if (dataGroupFunc) {
                await readGroupData();
            } else if (dataFunc) {
                await readData();
            } else {
                await readDataPage();
            }
        } catch (e: any) {
            instance.error = e;
            throw e;
        }
    }

    if (readBehavior == "immediate") {
        read();
    }
    onMount(() => {
        if (readBehavior == "onMount") {
            read();
        }
    });
</script>

<table
    class="table {classes || ''}"
    style={styles || ""}
    class:table-primary={primary}
    class:table-secondary={secondary}
    class:table-success={success}
    class:table-danger={danger}
    class:table-warning={warning}
    class:table-info={info}
    class:table-light={light}
    class:table-dark={dark}
    class:table-striped={striped}
    class:table-striped-columns={stripedColumns}
    class:table-hover={hover}
    class:table-bordered={bordered}
    class:table-borderless={borderless}
    class:table-sm={small}
    class:caption-top={caption || $$slots.caption}
    class:table-responsive={responsive}
    class:table-responsive-sm={responsiveSm}
    class:table-responsive-md={responsiveMd}
    class:table-responsive-lg={responsiveLg}
    class:table-responsive-xl={responsiveXl}
    class:table-responsive-xxl={responsiveXxl}>
    {#if caption || $$slots.caption}
        <caption>
            {caption}
            <slot name="caption" {instance} />
        </caption>
    {/if}
    <thead>
        <slot name="headerRow" {instance} />
        {#if typeof headers != "boolean" && headers.length}
            <tr>
                {#each headers as row}
                    {#if instanceOfIDataTableHeader(row)}
                        <th
                            scope="col"
                            class={row.class}
                            style="{row.width ? 'width: ' + row.width + ';' : ''}{row.minWidth
                                ? 'min-width: ' + row.minWidth + ';'
                                : ''}{row.style ?? ''}">
                            {row.text}
                        </th>
                    {:else if typeof row == "string"}
                        <th scope="col">{row}</th>
                    {/if}
                {/each}
            </tr>
        {:else if typeof headers == "boolean" && headers == true && _headers}
            <tr>
                {#each _headers as row}
                    <th scope="col"> {row}</th>
                {/each}
            </tr>
        {/if}
    </thead>
    <tbody class:table-group-divider={headerGroupDivider}>
        <slot name="topRow" {instance} />
        {#if instance.error}
            {#if $$slots.errorRow}
                <slot name="errorRow" {instance} error={instance.error} />
            {:else}
                <tr>
                    <td colspan="99999" class="text-center">
                        <div class="text-danger fw-bold">
                            <i class="bi bi-bug-fill" />
                            Error :(
                        </div>
                        <div class="">
                            Here is what we know so far: <div class="text-danger">
                                {instance.error}
                            </div>
                        </div>
                    </td>
                </tr>
            {/if}
        {:else if !instance.initialized && readBehavior != "custom"}
            {#if $$slots.placeholderRow}
                <slot name="placeholderRow" {instance} />
            {:else}
                <tr>
                    <td colspan="99999">
                        <Placeholder height={placeHolderHeight} />
                    </td>
                </tr>
            {/if}
        {:else if group}
            {#each Object.entries(group) as data, index}
                <slot name="groupRow" key={data[0]} group={data[1]} {index} {instance} />
                {#each data[1] as groupData, index}
                    <slot name="row" data={groupData} {index} {instance} />
                {/each}
            {/each}
        {:else if data && data.length}
            {#each data as data, index}
                <slot name="row" {data} {index} {instance} />
            {/each}
        {:else}
            <slot name="noResultsRow" {instance} />
        {/if}
        <slot name="bottomRow" {instance} />
    </tbody>
</table>

<style lang="scss">
</style>
