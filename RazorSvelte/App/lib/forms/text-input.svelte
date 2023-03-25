<script lang="ts">
    import { generateId } from "$lib/functions";

    interface $$Slots {
        label: { id: string };
    }

    export let value: string;
    export let type:
        | "email"
        | "number"
        | "password"
        | "search"
        | "tel"
        | "text"
        | "time"
        | "url"
        | "week" = "text";
    export let label = "";
    export let large = false;
    export let small = false;

    export let disabled = false;
    export let readonlyPlainText = false;
    export let readonly = readonlyPlainText;

    export let autocomplete = false;
    export let autocorrect = false;
    export let spellcheck = false;
    export let placeholder = "";

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

    const handleInput = (e: any) =>
        (value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value);
    const id = `${type}-${generateId(5)}`;
</script>

<div class={classes || ""} style={styles || ""}>
    {#if label}
        <label for={id} class="form-label">{label}</label>
    {/if}
    <slot name="label" {id} />
    <input
        {id}
        {type}
        class={readonlyPlainText ? "form-control-plaintext" : "form-control"}
        class:form-control-lg={large}
        class:form-control-sm={small}
        autocomplete={autocomplete ? "on" : "off"}
        autocorrect={autocorrect ? "on" : "off"}
        spellcheck={spellcheck ? "true" : "false"}
        {placeholder}
        {readonly}
        {disabled}
        {value}
        on:input={handleInput} />
</div>
