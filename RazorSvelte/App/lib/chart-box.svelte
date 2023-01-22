<script lang="ts">
    import Chart from "./chart.svelte";
    import Modal from "./modal.svelte";
    import {hideTooltips} from "./tooltips";
    /**
     * Chart title
     *
     * @default undefined
     */
    export let title: string;
    /**
     * One of the predefined chart types.
     *
     * @default undefined
     */
    export let type: ChartType;
    /**
     * Async function that returns data for the chart.
     *
     * @default undefined
     */
    export let dataFunc: (() => Promise<{labels: string[], series: {data: number[], label: string | undefined}[]}>);
    /**
     * Default series label. Will override series label returned from dataFunc 
     *
     * @default undefined
     */
    export let seriesLabel: string = "";
    /**
     * Minimum chart height in pixels
     *
     * @default ""
     */
    export let minHeight: string = "";
    /**
     * Display series legend?
     *
     * @default true if more than one series
     */
    export let displayLegend: boolean | undefined = undefined;
    /**
     * Show open in full screen icon in upper right corner
     *
     * @default true
     */
    export let showModal = true;
    /**
     * Show fullscreen modal controls (zoom, refresh)
     *
     * @default true
     */
    export let showModalControls = true;
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

    let chart: Chart;
    let modal = {open: false};
    let initialZoom = type=="pie" || type=="doughnut" ? 40 : 75;
    let zoom = initialZoom;
    let refreshing = false;

    function zoomIn() {
        zoom = zoom - 15;
    }
    function zoomOut() {
        zoom = zoom + 15;
    }
    async function refresh() {
        hideTooltips();
        refreshing = true;
        await chart.refreshChart();
        zoom = initialZoom;
        refreshing = false;
    }
</script>

<div class="title-wrap">
    <div class="text-secondary fw-bolder text-center fs-4">{title}</div>
    {#if showModal}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i class="bi bi-box-arrow-up-right" on:click={() => modal.open = true} data-bs-toggle="tooltip" title="Open in Fullscreen"></i>
    {/if}
</div>

{#if minHeight}
    <div class="chart-fixed-size {classes || ''}" style="min-height: {minHeight}; width: {minHeight}; {styles || ''}">
        <Chart bind:this={chart} type={type} dataFunc={dataFunc} seriesLabel={seriesLabel} displayLegend={displayLegend} />
    </div>
{:else}
    <Chart bind:this={chart} type={type} dataFunc={dataFunc} seriesLabel={seriesLabel} displayLegend={displayLegend} />
{/if}

{#if showModal}
<Modal state={modal} fullscreen={true} closeBtn={true}>
    <div slot="header" class="modal-header">
        <h5 class="modal-title">{title}</h5> 
        {#if showModalControls}
            <div class="btn-group">
                <button type="button" class="btn btn-light" data-bs-toggle="tooltip" title="Zoom In" on:click={zoomIn}>
                    <i class="bi bi-zoom-out"></i>
                </button>
                <button type="button" class="btn btn-light" data-bs-toggle="tooltip" title="Zoom Out" on:click={zoomOut}>
                    <i class="bi bi-zoom-in"></i>
                </button>
            </div>
            <div class="btn-group">
                <button type="button" disabled={refreshing} class="btn btn-light" data-bs-toggle="tooltip" title="Refresh" on:click={refresh}>
                    {#if refreshing}
                        <div class="spinner-border spinner-small" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    {:else}
                        <i class="bi bi-arrow-clockwise"></i>
                    {/if}
                </button>
            </div>
        {/if}
    </div>
    <div class="modal-wrap" style="grid-template-columns: {zoom}%">
        <Chart type={type} dataFunc={dataFunc} chartData={chart.getChartData()} />
    </div>
</Modal>
{/if}

<style lang="scss">
    $chart-spinner-border-color: var(--bs-primary);

    .chart-fixed-size {
        display: inline-block; 
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
    .title-wrap {
        display: grid;
        grid-template-columns: auto min-content;
    }
    .bi {
        cursor: pointer;
        align-self: start;
    }
    .modal-wrap {
        display: grid;
    }
    .spinner-small {
        width: 1rem;
        height: 1rem;
        border: 0.1em solid $chart-spinner-border-color;
        border-right-color: transparent;
    }
</style>