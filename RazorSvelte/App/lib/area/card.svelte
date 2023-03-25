<script lang="ts">
    interface $$Slots {
        /**
         * Card label shows descriptive text discretely in the top left corner of the card.
         */
        default: {};
        label: {};
        title: {};
        subtitle: {};
        footer: {};
    }

    /**
     * Card label shows descriptive text discretely in the top left corner of the card.
     */
    export let label = "";
    /**
     * Card title is the main heading of the card.
     */
    export let title = "";
    /**
     * Card subtitle is a secondary heading of the card.
     */
    export let subtitle = "";
    /**
     * Card text is the main content of the card. Main content can be set in a main slot or in the text property.
     */
    export let text = "";
    /**
     * Card footer is the footer of the card. Footer can be set in a footer slot or in the text property.
     */
    export let footer = "";
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

<div class="card {classes || ''}" style={styles || ""}>
    <div class="card-body">
        {#if label || $$slots.label}
            <div class="card-label">
                {label}
                <slot name="label" />
            </div>
        {/if}
        {#if title || $$slots.title}
            <h5 class="card-title">
                {title}
                <slot name="title" />
            </h5>
        {/if}
        {#if subtitle || $$slots.subtitle}
            <h6 class="card-subtitle mb-2 text-muted">
                {subtitle}
                <slot name="subtitle" />
            </h6>
        {/if}
        <p class="card-text">
            {text}
            <slot />
        </p>
        {footer}
        <slot name="footer" />
    </div>
</div>
