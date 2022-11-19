<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Placeholder from "./placeholder.svelte";

    export let placeholder = "";
    export let input: HTMLInputElement | undefined = undefined;
    export let value: string = "";
    export let small: boolean = false;
    export let large: boolean = false;
    export let searchTimeoutMs = 500;
    export let searching: boolean = false;
    export let initialized: boolean = true;
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

    let searchTimeout: NodeJS.Timeout | undefined;
    const dispatch = createEventDispatcher();

    function search() {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
        searchTimeout = setTimeout(() => {
            searchTimeout = undefined;
            if (searching) {
                search();
            } else {
                dispatch("search", {input, value});
            }
        }, searchTimeoutMs);
    }
</script>

{#if !initialized}
    <Placeholder class="{classes || ''}" style="{styles || ''}"  height={(large ? "50px" : (small ? "32px" : "38px"))} />
{:else}
    <div class="input {classes || ''}" style="{styles || ''}" class:input-group-sm={small} class:input-group-lg={large}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span 
            class={searching ? "spinner-border" : "bi-search"} 
            on:click={() => input?.focus()} 
            data-bs-toggle="tooltip"
            title="{searching ? "..." : (placeholder || "Search")}">
        </span>
        <input
            class="form-control"
            autocomplete="off" 
            autocorrect="off"
            spellcheck="false"
            type="text"
            bind:value={value} 
            bind:this={input} 
            on:input={search}
            on:focus={() => input?.select()}
            placeholder={placeholder} />
    </div>
{/if}

<style lang="scss">
    .input {
        align-items: center;
        display: flex;
        & > span {
            position: absolute;
            cursor: pointer;
            margin-left: 8px;
        }
        & > input {
            text-indent: 18px;
        }
        & > .spinner-border {
            width: 16px;
            height: 16px;
            opacity: 0.5;
        }
    }
</style>
