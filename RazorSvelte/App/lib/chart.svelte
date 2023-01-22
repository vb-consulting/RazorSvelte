<script lang="ts">
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";
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
    export let dataFunc: (() => Promise<{labels: string[], series: {data: number[], label: string | undefined}[]}>) | undefined = undefined;
    /**
     * Internal chart data, used for copying data and options from one chart to other to avoid extra requests.
     * If this prooperty is defined, `dataFunc` will be ignored.
     *
     * @default undefined
     */
    export let chartData: {data: any, options: any} | undefined = undefined;
    /**
     * Function that returns internal chart data from chart instance.
     */
    export const getChartData = () => {
        return {data: JSON.parse(JSON.stringify(chart.data)), options: JSON.parse(JSON.stringify(chart.options))}
    };
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
     * Refresh chart with new data from dataFunc
     *
     * @default basicColors if type line, otherwise chart default
     */
    export const refreshChart = async () => {
        if (!dataFunc) {
            return;
        }
        if (chart) {
            chart.destroy();
        }
        loading = true;
        let response = await dataFunc();
        loading = false;
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
                plugins: {
                    legend: {
                        display: displayLegend != undefined ? displayLegend : response.series.length > 1
                    }
                }
            }
        });
    }
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

    Chart.register(...registerables);

    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;
    let loading = false;

    let recreateChart = async () => {
        if (!chartCanvas) {
            return;
        }
        if (!chart) {
            if (!chartData) {
                await refreshChart();
            } else {
                loading = false;
                chart = new Chart(chartCanvas.getContext("2d") as any, {type, data: chartData.data, options: chartData.options});
            }
        } else {
            const {data, options} = getChartData();
            const prevCtx = chart.ctx;
            chart.destroy();
            chart = new Chart(prevCtx, {type, data, options});
        }
    }

    onMount(recreateChart);

    $: {
        if ($isDarkTheme) {
            Chart.defaults.color = defaultColorDarkTheme;
            Chart.defaults.borderColor = defaultBorderColorDarkTheme;
        } else {
            Chart.defaults.color = defaultColorLightTheme;
            Chart.defaults.borderColor = defaultBorderColorLightTheme;
        }
        if (chart) {
            recreateChart();
        }
    }

</script>

<div class="placeholder-glow {classes || ''}" style="{styles || ''}">
    {#if loading}
        <div class="chart-loading placeholder"></div>
    {/if}
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style lang="scss">
    .chart-loading  {
        width: 90%;
        height: 60%;
        margin: 10%;
        border-radius: 5%;
    }
</style>
