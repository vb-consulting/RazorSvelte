<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import Placeholder from "./placeholder.svelte";

    type T = $$Generic;

    interface $$Slots {
        row: { data: T, index: number, instance: IDataGrid };
        groupRow: { key: string, group: T[], index: number, instance: IDataGrid };
        caption: { instance: IDataGrid };
        placeholderRow: { instance: IDataGrid };
        headerRow: { instance: IDataGrid };
        topRow: { instance: IDataGrid };
        bottomRow: { instance: IDataGrid };
        noResultsRow: { instance: IDataGrid };
        errorRow: { instance: IDataGrid, error: any };
    }
    
    export let headers: boolean | string[] | IGridHeader[] = [];
    export let dataFunc: (() => Promise<T[]>) | undefined = undefined;
    export let dataGroupFunc: (() => Promise<Record<string, T[]>>) | undefined = undefined;
    export let dataPageFunc: ((instance: IDataGrid) => Promise<{count: number; page: T[]}>) | undefined = undefined;

    export let primary = false;
    export let secondary = false;
    export let success = false;
    export let danger = false;
    export let warning = false;
    export let info = false;
    export let light = false;
    export let dark = false;
    export let striped = false;
    export let stripedColumns = false;
    export let hover = false;
    export let bordered = false;
    export let borderless  = false;
    export let small  = false;

    export let responsive = false;
    export let responsiveSm = false;
    export let responsiveMd = false;
    export let responsiveLg = false;
    export let responsiveXl = false;
    export let responsiveXxl = false;

    export let caption = "";
    export let headerGroupDivider = false;

    export let take: number = 50;
    export let readBehavior: LifeCycleType = "immediate";

    export let placeHolderHeight: string = "100px";

    export const instance: IDataGrid = {
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

    function instanceOfIGridHeader(value: any): value is IGridHeader {
        if (typeof value == "string") {
            return false;
        }
        return "text" in value;
    }

    async function readGroupData() {
        if (!dataGroupFunc || instance.working) {
            return;
        }
        dispatch("render", {instance: instance});
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
        setTimeout(() => dispatch("rendered", {instance: instance, data: group}));
    }

    async function readData() {
        if (!dataFunc || instance.working) {
            return;
        }
        dispatch("render", {instance: instance});
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
        setTimeout(() => dispatch("rendered", {instance: instance, data}));
    }

    async function readDataPage() {
        if (!dataPageFunc || instance.working) {
            return;
        }
        dispatch("render", {instance: instance});
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
        setTimeout(() => dispatch("rendered", {instance: instance, data}));
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
<table class="table {classes || ''}" style="{styles || ''}"
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
            <slot name="caption" {instance}></slot>
        </caption>
    {/if}
    <thead>
        <slot name="headerRow" {instance}></slot>
        {#if (typeof headers != "boolean" && headers.length)}
            <tr>
                {#each headers as row}
                    {#if (instanceOfIGridHeader(row))}
                        <th 
                            scope="col" 
                            class="{row.class}"
                            style="{(row.width ? "width: " + row.width +";" : "")}{(row.minWidth ? "min-width: " + row.minWidth +";" : "")}{row.style ?? ""}">
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
        <slot name="topRow" {instance}></slot>
        {#if instance.error}
            {#if $$slots.errorRow}
                <slot name="errorRow" {instance} error={instance.error}></slot>
            {:else}
                <tr>
                    <td colspan=99999 class="text-center">
                        <div class="text-danger fw-bold">
                            <i class="bi bi-bug-fill"></i>
                            Error :(
                        </div>
                        <div class="">
                            Here is what we know so far: <div class="text-danger">{instance.error}</div>
                        </div>
                    </td>
                </tr>
            {/if}
        {:else if !instance.initialized}
            {#if $$slots.placeholderRow}
                <slot name="placeholderRow" {instance}></slot>
            {:else}
                <tr>
                    <td colspan=99999>
                        <Placeholder height={placeHolderHeight} />
                    </td>
                </tr>
            {/if}
        {:else}
            {#if group}
                {#each Object.entries(group) as data, index}
                    <slot name="groupRow" key={data[0]} group={data[1]} {index} {instance}></slot>
                    {#each data[1] as groupData, index}
                        <slot name="row" data={groupData} {index} {instance}></slot>
                    {/each}
                {/each}
            {:else if data && data.length}
                {#each data as data, index}
                    <slot name="row" {data} {index} {instance}></slot>
                {/each}
            {:else}
                <slot name="noResultsRow" {instance}></slot>
            {/if}
        {/if}
        <slot name="bottomRow" {instance}></slot>
    </tbody>
</table>

<style lang="scss">
</style>
