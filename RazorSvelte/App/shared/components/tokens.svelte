<script lang="ts">

    type T = $$Generic;

    export let tokens: T[];
    export let disabled: boolean | undefined = undefined;
    export let selected: (area: T) => boolean = () => false;
    export let click: ((area: T) => void) | undefined = undefined;
    export let tooltip: (area: T) => string = () => "";
    export let href: ((area: T) => string) | undefined = undefined;
    /**
     * A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().
     */
    export { classes as class };
    /*
    * Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the style element have mainly the purpose of allowing for quick styling, for example for testing purposes.
    */
    export { styles as style };

    export let tokenClass: string = "";
    export let tokenStyle: string = "";
    export let tokenColorTheme: ColorThemeType = href || click ? "primary" : "secondary";
    
    let classes: string = "";
    let styles: string = "";

    function instanceOfIToken(value: any): value is IToken {
        if (typeof value == "string") {
            return false;
        }
        return "name" in value;
    }
</script>

<div class="d-flex flex-wrap {classes || ''}" style="{styles || ''}">
    {#each tokens as token}
        {#if href}
            <a 
                class="{tokenClass || ''} clickable-token mb-1 {tokenColorTheme == "none" ? "" : "text-bg-" + tokenColorTheme}" 
                style="{tokenStyle || ''}"
                {disabled} 
                class:selected={selected(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}
                href={href(token)}>
                {instanceOfIToken(token) ? token.name : token}
            </a>
        {:else if click}
            <button 
                class="{tokenClass || ''} clickable-token mb-1 {tokenColorTheme == "none" ? "" : "text-bg-" + tokenColorTheme}" 
                style="{tokenStyle || ''}"
                {disabled} 
                class:selected={selected(token)}
                on:click={() => click && click(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}>
                {instanceOfIToken(token) ? token.name : token}
            </button>
        {:else}
            <div 
                class="{tokenClass || ''} token mb-1 {tokenColorTheme == "none" ? "" : "text-bg-" + tokenColorTheme}" 
                style="{tokenStyle || ''}"
                {disabled} 
                class:selected={selected(token)}
                data-bs-toggle="{tooltip(token) ? "tooltip" : ""}" 
                title={tooltip(token)}>
                {instanceOfIToken(token) ? token.name : token}
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
</style> 
