<script lang="ts">
    export let score: number;
    export let from: number = 1;
    export let to: number = 5;
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

<span class="{classes || ''}" style="{styles || ''}">
    {#each Array(to - from + 1) as _, i}
        {#if i < score}
            {#if score > Math.floor(score) && i == Math.floor(score)}
                <i class="bi-star-half"></i>
            {:else}
                <i class="bi-star-fill"></i>
            {/if}
        {:else}
            <i class="bi-star"></i>
        {/if}
    {/each}
</span>

<style lang="scss">
</style>
