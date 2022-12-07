<script lang="ts">
    export let tokens: IToken[];
    export let disabled: boolean | undefined = undefined;
    export let selected: (area: IToken) => boolean = () => false;
    export let click: ((area: IToken) => void) | undefined = undefined;
    export let tooltip: (area: IToken) => string = () => "";
    export let href: ((area: IToken) => string) | undefined = undefined;
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
</script>

<div class="d-flex flex-wrap {classes || ''}" style="{styles || ''}">
    {#each tokens as token}
        {#if href}
            <a 
                class="clickable-token mb-1" 
                {disabled} 
                class:selected={selected(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}
                href={href(token)}>
                {token.name}
            </a>
        {:else if click}
            <button 
                class="clickable-token mb-1" 
                {disabled} 
                class:selected={selected(token)}
                on:click={() => click && click(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}>
                {token.name}
            </button>
        {:else}
            <div 
                class="token text-bg-secondary mb-1" 
                {disabled} 
                class:selected={selected(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}>
                {token.name}
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
</style> 
