<script lang="ts">
    import { Chart, registerables } from "chart.js";
    import { onMount, onDestroy } from "svelte";
    import { isDarkTheme } from "$lib/theme";
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
    export let basicColors = [
        "red",
        "yellow",
        "blue",
        "orange",
        "green",
        "violet",
        "purple",
        "magenta",
        "grey",
        "brown",
        "pink",
        "aqua",
        "navy"
    ];
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
    export let seriesBackgroundColor: string[] | string | undefined =
        type == "line" ? undefined : basicColors;
    /**
     * Color for series
     *
     * @default basicColors if type line, otherwise chart default
     */
    export let seriesColor: string[] | string | undefined =
        type == "line" ? basicColors : undefined;
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
            return {
                data: JSON.parse(JSON.stringify(_chart.data)),
                options: JSON.parse(JSON.stringify(_chart.options))
            };
        },
        refreshChart: async () => {
            if (!dataFunc) {
                return;
            }
            if (_chart && _chart) {
                _chart.destroy();
            }
            instance.loading = true;
            let response = await dataFunc();
            instance.loading = false;
            if (!response) {
                return;
            }
            let len = response.series.length;

            _chart = new Chart(_chartCanvas.getContext("2d") as any, {
                type,
                data: {
                    labels: response.labels,
                    datasets: response.series.map((series, index) =>
                        Object({
                            backgroundColor:
                                len > 1
                                    ? basicColors[index % basicColors.length]
                                    : seriesBackgroundColor,
                            label: seriesLabel || series.label,
                            data: series.data,
                            borderColor: seriesColor
                        })
                    )
                },
                options: {
                    maintainAspectRatio,
                    plugins: {
                        legend: {
                            display:
                                displayLegend != undefined
                                    ? displayLegend
                                    : response.series.length > 1
                        }
                    }
                }
            }) as Chart;
        },
        recreateChart: async () => {
            if (!_chartCanvas) {
                return;
            }
            if (!_chart) {
                if (!chartState) {
                    await instance.refreshChart();
                } else {
                    instance.loading = false;
                    _chart = new Chart(_chartCanvas.getContext("2d") as any, {
                        type,
                        data: chartState.data,
                        options: chartState.options
                    }) as Chart;
                }
            } else {
                const { data, options } = instance.getChartState();
                const prevCtx = _chart.ctx;
                _chart.destroy();
                _chart = new Chart(prevCtx, { type, data, options }) as Chart;
            }
        }
    };
    /*
     * Internal Chart state. You can pass data and the state from another chart with getChartState instance method.
     */
    export let chartState: ChartStateInternal | undefined = undefined;

    let classes: string = "";
    let styles: string = "";

    Chart.register(...registerables);
    let _chartCanvas: HTMLCanvasElement;
    let _chart: Chart;

    let resizeTimeout: number | undefined;
    function windowResize() {
        if (_chart) {
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
        if (_chart) {
            _chart.destroy();
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
            if (_chart) {
                instance.recreateChart();
            }
        }
    }
</script>

{#if instance.loading}
    <div class="placeholder-glow {classes || ''}" style={styles || ""}>
        <div class="chart-loading placeholder rounded" />
    </div>
{/if}
<canvas bind:this={_chartCanvas} class:d-none={instance.loading} />

<style lang="scss">
    .chart-loading {
        width: 90%;
        height: 100px;
    }
</style>
