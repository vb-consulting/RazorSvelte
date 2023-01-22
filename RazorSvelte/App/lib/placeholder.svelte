<script lang="ts">
    export let height: string = "";
    export let width: string = "";
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
<div class="placeholder-glow {classes || ''}" style="{styles || ''}">
    <span 
        class="placeholder placeholder-lg col-12 rounded" 
        style="{height ? `height: ${height};` : ""}{width ? `width: ${width};` : ""}">
    </span>
</div>

<style lang="scss">
</style>