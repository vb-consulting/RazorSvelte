<script lang="ts">
    import Placeholder from "./placeholder.svelte";

    interface $$Slots {
        message: { grid: IDataGrid };
    }

    export let grid: IDataGrid;
    export let numberCount: number = 3;
    export let small: boolean = false;
    export let large: boolean = false;
    export let prevNextButtons: boolean = true;
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

    let numbers: number[];
    let lastPage = 0;

    function setPage(page: number) {
        if (grid.working || grid.page == page || !grid.initialized) {
            return;
        }
        grid.setPage(page);
    }

    $: {
        if (grid) {
            let index = !numbers ? -1 : numbers.indexOf(grid.page);
            if (numbers && index != -1 && index > 0 && index < numbers.length - 1) {
                lastPage = grid.page;
            } else {
                numbers = [];
                let from = grid.page - 1 < 1 ? 1 : grid.page - 1;
                let to: number;
                if (from + numberCount > grid.pageCount) {
                    to = grid.pageCount;
                    from = grid.pageCount - numberCount < 1 ? 1 : grid.pageCount - numberCount;
                }
                else {
                    to = from + numberCount;
                }
                for(let page = from; page <= to; page++) {
                    numbers.push(page);
                }
                lastPage = grid.page;
            }
        }
    }
</script>

{#if !grid?.initialized}
    <Placeholder class="{classes || ''}" style="{styles || ''}" height="45px" width="250px"/>
{:else if grid.pageCount > 0}
    <div class="{classes || ''}" style="{styles || ''}">
        <nav>
            <ul class="pagination" class:pagination-sm={small} class:pagination-lg={large}>
                {#if numbers && numbers.indexOf(1) == -1}
                    <li class="page-item" class:disabled={grid.working}>
                        <button class="page-link" on:click={() => setPage(1)}>First</button>
                    </li>
                {/if}
                {#if grid.page > 1 && prevNextButtons}
                    <li class="page-item" class:disabled={grid.working}>
                        <button class="page-link" on:click={() => setPage(grid.page-1)}>Previous</button>
                    </li>
                {/if}
                {#each numbers as number}
                    <li class="page-item" class:active={grid.page == number} class:disabled={grid.working}>
                        <button class="page-link" class:disabled={grid.page == number} class:active={grid.page == number} on:click={() => setPage(number)}>{number}</button>
                    </li>
                {/each}
                {#if grid.page < grid.pageCount && prevNextButtons}
                    <li class="page-item" class:disabled={grid.working}>
                        <button class="page-link" on:click={() => setPage(grid.page+1)}>Next</button>
                    </li>
                {/if}
                {#if numbers && numbers.indexOf(grid.pageCount) == -1}
                    <li class="page-item" class:disabled={grid.working}>
                        <button class="page-link" on:click={() => setPage(grid.pageCount)}>Last</button>
                    </li>
                {/if}
            </ul>
        </nav>
        <div class="text-primary info" class:text-muted={grid.working} style="{small ? "font-size: 0.75rem;" : ""}">
            {#if grid.working}<div class="spinner-border"></div>{/if}
            {#if  $$slots.message}
                <slot name="message" {grid}></slot>
            {:else}
                Page <b>{grid.page.toLocaleString()}</b> of <b>{grid.pageCount.toLocaleString()}</b>. Total <b>{grid.count.toLocaleString()}</b>.
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    nav {
        user-select: none;
    }
    .info {
        user-select: none;
        font-size: 0.85rem;
        white-space: nowrap;
        & > div {
            font-size: 0.85rem;
            width: 15px;
            height: 15px;
        }
    }
    button.active.disabled {
        background-color: var(--bs-primary);
    }
    .pagination {
        margin-bottom: 0px;
    }
    button {
        border-style: outset;
        border-color: buttonborder;
    }
</style>
