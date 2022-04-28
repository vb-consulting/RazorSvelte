<script lang="ts">
    import Layout from "./shared/layout/main.svelte";
    import Modal from "./shared/components/modal.svelte";
    import Offcanvas from "./shared/components/offcanvas.svelte";

    let selectionValue: string = "";
    let selectionElement: HTMLSelectElement;
    $: selectedText = selectionValue ? selectionElement.options[selectionElement.selectedIndex].innerText : "";

    let modal1 = {open: false};
    let modal2 = {open: false};

    let offcanvas1 = {open: false};
    let offcanvas2 = {open: false};
</script>

<Layout>
    <div class="container pt-4">

        <h1 class="text-center text-primary">
            Hello World from Svelte, Boostrap and Razor
        </h1>

        <div class="shadow-lg card mt-3">
            <div class="card-body">
                <div class="card-title h5">Select What Do You Want to Learn Today</div>
                <select class="form-select form-select-lg mb-3" bind:value={selectionValue} bind:this={selectionElement}>
                    <option selected value="">Open this select menu</option>
                    <option value="https://docs.microsoft.com/aspnet/core">Building Web apps with ASP.NET Core</option>
                    <option value="https://svelte.dev/">SVELTE: CYBERNETICALLY ENHANCED WEB APPS</option>
                    <option value="https://svelte.dev/tutorial/basics">Svlete Tutorial</option>
                    <option value="https://getbootstrap.com/docs/5.1/getting-started/introduction/">Bootstrap</option>
                    <option value="https://sass-lang.com/guide">SASS and SCSS Languague</option>
                </select>
                {#if selectionValue}
                <a class="btn btn-primary" href="{selectionValue}" target="_blank">{selectedText}</a>
                {/if}
            </div>
        </div>

        <div class="shadow-lg card mt-3">
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

    </div>
</Layout>

<Modal state={modal1} 
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

