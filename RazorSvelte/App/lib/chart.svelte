<script lang="ts">
    import { Chart, registerables } from "chart.js";
    import { onMount, onDestroy } from "svelte";
    import { isDarkTheme } from "../shared/layout/theme";
    /**
     * One of the predefined chart types.
     *
     * @default undefined
     */
    export let type: ChartType;
    /**
     * Async function that returns data for the chart.
     * This function will not be used and it doesn't have to be defined if chartData property is used.
     *
     * @default undefined
     */
    export let dataFunc: (() => Promise<IChartData>) | undefined = undefined;
    /**
     * Default series label. Will override series label returned from dataFunc 
     *
     * @default undefined
     */
    export let seriesLabel: string | undefined = undefined;
    /**
     * Default color for dark theme
     *
     * @default #b7c8d8
     */
    export let defaultColorDarkTheme = "#b7c8d8";
    /**
     * Default border color for dark theme
     *
     * @default #6c757d
     */
    export let defaultBorderColorDarkTheme = "#6c757d";
    /**
     * Default color for light theme
     *
     * @default #666
     */
    export let defaultColorLightTheme = "#666";
    /**
     * Default border color for light theme
     *
     * @default #666
     */
    export let defaultBorderColorLightTheme = "#666";
    /**
     * Basic set of color that will be assigned for either values or series
     *
     * @default ["red", "yellow","blue","orange","green", "violet", "purple", "magenta", "grey", "brown", "pink", "aqua", "navy"]
     */
    export let basicColors = ["red", "yellow","blue","orange","green", "violet", "purple", "magenta", "grey", "brown", "pink", "aqua", "navy"];
    /**
     * Display series legend?
     *
     * @default true if more than one series
     */
    export let displayLegend: boolean | undefined = undefined;
    /**
     * Background color for series
     *
     * @default basicColors if type not line, otherwise chart default
     */
    export let seriesBackgroundColor: string[] | string | undefined = (type == "line" ? undefined : basicColors);
    /**
     * Color for series
     *
     * @default basicColors if type line, otherwise chart default
     */
    export let seriesColor: string[] | string | undefined = (type == "line" ? basicColors : undefined);
    /**
     * Maintain the original canvas aspect ratio (width / height) when resizing.
     * @default true
     */
    export let maintainAspectRatio: boolean = true;
    /**
     * A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().
     */
    export { classes as class };
    /*
    * Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the style element have mainly the purpose of allowing for quick styling, for example for testing purposes.
    */
    export { styles as style };
    /**
     * Chart instance object
     */
    export const instance: IChart = {
        loading: false,
        getChartState: () => {
            return {data: JSON.parse(JSON.stringify(chart.data)), options: JSON.parse(JSON.stringify(chart.options))}
        },
        refreshChart: async () => {
            if (!dataFunc) {
                return;
            }
            if (chart && chart) {
                chart.destroy();
            }
            instance.loading = true;
            let response = await dataFunc();
            instance.loading = false;
            if (!response) {
                return;
            }
            let len = response.series.length;
            
            chart = new Chart(chartCanvas.getContext("2d") as any, {
                type,
                data: {
                    labels: response.labels,
                    datasets: response.series.map((series, index) => Object({ 
                        backgroundColor: len > 1 ? basicColors[index % basicColors.length] : seriesBackgroundColor,
                        label: seriesLabel || series.label,
                        data: series.data,
                        borderColor: seriesColor,
                    }))

                },
                options: {
                    maintainAspectRatio,
                    plugins: {
                        legend: {
                            display: displayLegend != undefined ? displayLegend : response.series.length > 1
                        }
                    }
                }
            });
        },
        recreateChart: async () => {
            if (!chartCanvas) {
                return;
            }
            if (!chart) {
                if (!chartState) {
                    await instance.refreshChart();
                } else {
                    instance.loading = false;
                    chart = new Chart(chartCanvas.getContext("2d") as any, {type, data: chartState.data, options: chartState.options});
                }
            } else {
                const {data, options} = instance.getChartState();
                const prevCtx = chart.ctx;
                chart.destroy();
                chart = new Chart(prevCtx, {type, data, options});
            }
        }
    }
    /*
    * Internal Chart state. You can pass data and the state from another chart with getChartState instance method.
    */
    export let chartState: ChartStateInternal | undefined = undefined;
    
    let classes: string = "";
    let styles: string = "";

    Chart.register(...registerables);
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;

    let resizeTimeout: NodeJS.Timeout | undefined;
    function windowResize() {
        if (chart) {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                instance.recreateChart();
                resizeTimeout = undefined;
            }, 500);
        }
    }

    if (maintainAspectRatio) {
        window.addEventListener("resize", windowResize);
    }

    onMount(instance.recreateChart);
    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
        if (maintainAspectRatio) {
            window.removeEventListener("resize", windowResize);
        }
    });

    let darkTheme = $isDarkTheme;
    $: {
        if (darkTheme != $isDarkTheme) {
            if ($isDarkTheme) {
                Chart.defaults.color = defaultColorDarkTheme;
                Chart.defaults.borderColor = defaultBorderColorDarkTheme;
            } else {
                Chart.defaults.color = defaultColorLightTheme;
                Chart.defaults.borderColor = defaultBorderColorLightTheme;
            }
            darkTheme = $isDarkTheme;
            if (chart) {
                instance.recreateChart();
            }
        }
    }
</script>

{#if instance.loading}
<div class="placeholder-glow {classes || ''}" style="{styles || ''}">
    <div class="chart-loading placeholder rounded"></div>
</div>
{/if}
<canvas bind:this={chartCanvas} class:d-none={instance.loading}></canvas>

<style lang="scss">
    .chart-loading  {
        width: 90%;
        height: 100px;
    }
</style>
