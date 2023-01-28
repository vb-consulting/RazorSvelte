<script lang="ts">
    import Layout from "./shared/layout/default";
    import ChartBox from "./lib/chart-box.svelte";
    import Chart from "./lib/chart.svelte";
    import Card from "./lib/card.svelte";

    import urls from "./shared/urls";
    import { get } from "./shared/fetch";
</script>

<Layout>
    <div class="container text-center">
        <h1>Chart Component Demo</h1>

        <Card class="shadow-lg mb-3" label="Chart">
            <div class="row">
                <div class="col-md-4 chart">
                    <Chart type="bar" dataFunc={() => get(urls.chart1Url)} />
                </div>
                <div class="col-md-4 chart">
                    <Chart  type="line" dataFunc={() => get(urls.chart2Url)} />
                </div>
                <div class="col-md-4 hart">
                    <Chart type="pie" dataFunc={() => get(urls.chart3Url)} displayLegend={true} />
                </div>
            </div>
        </Card>

        <h1>ChartBox Component Demo</h1>
        <p>ChartBox is wrapper around Chart with added styling, loading placefolder, title and open in full screen button. And Chart is a wrapper around ChartJS.</p>

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
                        dataFunc={() => get(urls.chart2Url)}
                        title="Top 5 companies by the number of employees - employee growth last 10 years" />
                </div>
                <div class="col-md-4 hart">
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