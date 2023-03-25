<script lang="ts">
    import Chart from "$charting/chart.svelte";
    import Modal from "$overlay/modal.svelte";
    import { hideTooltips } from "$element/tooltips";
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
    export let dataFunc: () => Promise<{
        labels: string[];
        series: { data: number[]; label: string | undefined }[];
    }>;
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
     * Maintain the original canvas aspect ratio (width / height) when resizing.
     * @default true
     */
    export let maintainAspectRatio: boolean = true;
    /**
     * Chart instance object
     */
    export let instance: IChart | undefined = undefined;
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

    let modal = { open: false };
    let initialZoom = 100;
    let zoom = initialZoom;

    function zoomIn() {
        zoom = zoom - 15;
    }
    function zoomOut() {
        zoom = zoom + 15;
    }
    async function refresh() {
        if (!instance) {
            return;
        }
        hideTooltips();
        await instance.refreshChart();
    }
</script>

<div class="title-wrap">
    {#if title}
        <div class="text-secondary fw-bolder text-center fs-6">{title}</div>
    {/if}
    {#if showModal}
        <i
            class="fullscreen material-icons-outlined"
            on:click={() => (modal.open = true)}
            on:keypress={() => (modal.open = true)}
            data-bs-toggle="tooltip"
            title="Open in Fullscreen">fullscreen</i>
    {/if}
</div>

{#if minHeight}
    <div
        class="chart-fixed-size {classes || ''}"
        style="min-height: {minHeight}; width: {minHeight}; {styles || ''}">
        <Chart
            bind:instance
            {type}
            {dataFunc}
            {seriesLabel}
            {displayLegend}
            {maintainAspectRatio} />
    </div>
{:else}
    <Chart bind:instance {type} {dataFunc} {seriesLabel} {displayLegend} {maintainAspectRatio} />
{/if}

{#if showModal}
    <Modal state={modal} fullscreen={true} closeBtn={true}>
        <div slot="header" class="modal-header">
            <h5 class="modal-title">{title}</h5>
            {#if showModalControls}
                <div class="btn-group">
                    <button type="button" class="btn btn-light" on:click={zoomIn}>
                        <i class="material-icons-outlined">zoom_out</i>
                    </button>
                    <button type="button" class="btn btn-light" on:click={zoomOut}>
                        <i class="material-icons-outlined">zoom_in</i>
                    </button>
                </div>
                <div class="btn-group">
                    <button
                        type="button"
                        disabled={instance?.loading}
                        class="btn btn-light"
                        data-bs-toggle="tooltip"
                        title="Refresh"
                        on:click={refresh}>
                        {#if instance?.loading}
                            <div class="spinner-border spinner-small" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        {:else}
                            <i class="material-icons-outlined">refresh</i>
                        {/if}
                    </button>
                </div>
            {/if}
        </div>
        <div class="modal-wrap" style="width: {zoom}%; height: {zoom}%;">
            <Chart bind:instance {type} {dataFunc} chartState={instance?.getChartState()} />
        </div>
    </Modal>
{/if}

<style lang="scss">
    @import "../scss/variables";
    $chart-spinner-border-color: $primary;

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
    .fullscreen {
        cursor: pointer;
        align-self: start;
    }
    .spinner-small {
        width: 1rem;
        height: 1rem;
        border: 0.1em solid $chart-spinner-border-color;
        border-right-color: transparent;
    }
</style>
