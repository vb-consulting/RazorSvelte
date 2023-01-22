<script lang="ts">
    import Layout from "./shared/layout/default";
    import Card from "./lib/card.svelte";
    // import Modal from "./lib/modal.svelte";
    // import Offcanvas from "./lib/offcanvas.svelte";
    // import ChartBox from "./lib/chart-box.svelte";
    // import urls from "./shared/urls";
    // import { get } from "./shared/fetch";

    let selectionValue: string = "";
    let selectionElement: HTMLSelectElement;
    $: selectedText = selectionValue ? selectionElement.options[selectionElement.selectedIndex].innerText : "";

    // let modal1 = {open: false};
    // let modal2 = {open: false};

    // let offcanvas1 = {open: false};
    // let offcanvas2 = {open: false};

    // let count = 0;
</script>

<Layout>
    <div class="container pt-4">

        <h1 class="text-center text-primary">
            Hello World from Svelte, Boostrap and Razor
        </h1>

        <Card class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Select What Do You Want to Learn Today</div>
                <select class="form-select form-select-lg mb-3" bind:value={selectionValue} bind:this={selectionElement}>
                    <option selected value="">Open this select menu</option>
                    <option value="https://docs.microsoft.com/aspnet/core">Building Web apps with ASP.NET Core</option>
                    <option value="https://svelte.dev/">SVELTE: CYBERNETICALLY ENHANCED WEB APPS</option>
                    <option value="https://svelte.dev/tutorial/basics">Svlete Tutorial</option>
                    <option value="https://getbootstrap.com/docs/">Bootstrap</option>
                    <option value="https://sass-lang.com/guide">SASS and SCSS Languague</option>
                </select>
                {#if selectionValue}
                <a class="btn btn-primary" href="{selectionValue}" target="_blank" rel="noreferrer">{selectedText}</a>
                {/if}
            </div>
        </Card>

        <!-- <div class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Modal Component Demo</div>
                <div>
                    <button class="btn btn-secondary" on:click={() => modal1.open = true}>Example 1</button>
                    <button class="btn btn-secondary" on:click={() => modal2.open = true}>Example 2</button>
                </div>
            </div>
        </div>

        <div class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Offcanvas Component Demo</div>
                <div>
                    <button class="btn btn-secondary" on:click={() => offcanvas1.open = true}>Example 1</button>
                    <button class="btn btn-secondary" on:click={() => offcanvas2.open = true}>Example 2</button>
                </div>
            </div>
        </div>

        <div class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Tooltip demo</div>
                <div>
                    <button class="btn btn-secondary"  data-bs-toggle="tooltip" title="This button has been pressed {count} times." on:click={() => count++}>This is a button with a tooltip</button>
                </div>
            </div>
        </div>

        <div class="shadow-lg card mt-3">
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
        </div>

        <br /> -->
    </div>
</Layout>

<!-- <Modal state={modal1}
    content={"some content"} 
    title={"some title"} 
    titleCloseButton={true} 
    large={true} 
    buttons={[
        {text: "Do", click: () => modal1.open = false}
]}/>

<Modal state={modal2}>
    <span slot="title">modal2 title</span>

    <div class="text-center">
        <i class="spinner-border" style="width: 3rem; height: 3rem;"></i>
    </div>

    <span slot="footer">modal2 footer</span>
</Modal>

<Offcanvas state={offcanvas1} 
    content={"some content"} 
    title={"some title"} 
    titleCloseButton={true} 
/>

<Offcanvas state={offcanvas2} orientation={"end"}>
    <span slot="title">offcanvas2 title</span>

    <div class="text-center">
        <i class="spinner-border" style="width: 3rem; height: 3rem;"></i>
    </div>
</Offcanvas>

<style lang="scss">
    .chart {
        padding: 25px;
    }
</style> -->