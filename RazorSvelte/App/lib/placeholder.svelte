<script lang="ts">
    export let height: string = "";
    export let width: string = "";
    export let small: boolean = false;
    export let len: number = 1;
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

    $: {
        if (small) {
            height = "31px";
        }
        if (!width && height) {
            width = len * Number(height.replace("px", "")) + "px";
        }
    }
</script>

<div class="placeholder-wave {classes || ''}" style={styles || ""}>
    <span
        class="placeholder rounded"
        style="{height ? `height: ${height};` : ''}{width ? `width: ${width};` : ''}" />
</div>

<style lang="scss">
</style>
