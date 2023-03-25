<script lang="ts">
    import { generateId } from "$lib/functions";

    export let value: string;

    export let radios: string[] = [];
    export let label = "";
    export let inline = false;
    export let reverse = false;
    export let large = false;
    export let small = false;
    export let disabled = false;

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

    //const handleInput = (e: any) => value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
    const name = `radios-${generateId(5)}`;
</script>

<div class={classes || ""} style={styles || ""}>
    {#if label}
        <label for={name} class="form-label d-block">{label}</label>
    {/if}
    {#each radios as radio, index}
        <div class="form-check" class:form-check-inline={inline} class:form-check-reverse={reverse}>
            <input
                class="form-check-input"
                class:form-control-lg={large}
                class:form-control-sm={small}
                type="radio"
                {name}
                {disabled}
                id={name + index}
                value={radio}
                bind:group={value} />
            <label
                class="form-check-label"
                class:form-control-lg={large}
                class:form-control-sm={small}
                for={name + index}>
                {radio}
            </label>
        </div>
    {/each}
</div>
