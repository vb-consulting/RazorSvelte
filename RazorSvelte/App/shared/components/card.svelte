<script lang="ts">
    export let label = "";
    export let title = "";
    export let subtitle = "";
    export let text = "";
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

<div class="card {classes || ''}" style="{styles || ''}">
  <div class="card-body">
    {#if label}<div class="card-label">{label}</div>{/if}
    {#if title}<h5 class="card-title">{title}</h5>{/if}
    {#if subtitle}<h6 class="card-subtitle mb-2 text-muted">{subtitle}</h6>{/if}
    <p class="card-text">
      {text}
      <slot></slot>
    </p>
    <slot name="footer"></slot>
  </div>
</div>

<style lang="scss">
</style> 
