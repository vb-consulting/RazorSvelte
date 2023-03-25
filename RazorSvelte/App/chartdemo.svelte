<script lang="ts">
    import Layout from "$shared/layout.svelte";
    import ChartBox from "$charting/chart-box.svelte";
    import Chart from "$charting/chart.svelte";
    import Card from "$area/card.svelte";
    import { get } from "$lib/fetch";

    import urls from "$shared/urls";

    let chart3: IChart;
    let chart2: IChart;
</script>

<Layout>
    <div class="container text-center">
        <h3>Chart Component Demo</h3>
        <p>Chart Component is wrapper around ChartJS.</p>
        <p>This component handles loading placeholder, window resizing and theme colors.</p>

        <Card class="shadow-lg mb-3" label="Chart Component">
            <div class="row">
                <div class="col-md-4 chart">
                    <Chart type="bar" dataFunc={() => get(urls.chart1Url)} />
                </div>
                <div class="col-md-4 chart">
                    <Chart type="line" dataFunc={() => get(urls.chart2Url)} />
                </div>
                <div class="col-md-4 chart">
                    <Chart
                        type="pie"
                        bind:instance={chart3}
                        dataFunc={() => get(urls.chart3Url)}
                        displayLegend={true} />
                    <button
                        class="btn btn-primary btn-sm mt-3"
                        disabled={chart3?.loading}
                        on:click={() => chart3.refreshChart()}>refresh</button>
                </div>
            </div>
        </Card>

        <h3>ChartBox Component Demo</h3>
        <p>ChartBox Component is wrapper around Chart. And Chart is a wrapper around ChartJS.</p>
        <p>This component Adds additional title and fullscreen with zoom in and out.</p>

        <Card class="shadow-lg mt-3 mb-5" label="ChartBox Component">
            <div class="row">
                <div class="col-md-4 chart">
                    <ChartBox
                        type="bar"
                        dataFunc={() => get(urls.chart1Url)}
                        title="Number of employees by area - for the top 3 companies by the number of employees" />
                </div>
                <div class="col-md-4 chart">
                    <ChartBox
                        type="line"
                        bind:instance={chart2}
                        dataFunc={() => get(urls.chart2Url)}
                        title="Top 5 companies by the number of employees - employee growth last 10 years" />
                    <button
                        class="btn btn-primary btn-sm mt-3"
                        disabled={chart2?.loading}
                        on:click={() => chart2.refreshChart()}>refresh</button>
                </div>
                <div class="col-md-4 chart">
                    <ChartBox
                        type="pie"
                        dataFunc={() => get(urls.chart3Url)}
                        minHeight="300px"
                        displayLegend={true}
                        title="Top 10 companies by the country" />
                </div>
            </div>
        </Card>
    </div>
</Layout>

<style lang="scss">
    .chart {
        padding: 1rem;
    }
</style>
