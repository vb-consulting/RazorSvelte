<script lang="ts">
    /**
     * HTML element name that contains an icon class in lowercase.
     * @default "i"
     */
    export let element: keyof HTMLElementTagNameMap = "i";
    /**
     * Bootstrap icon name.
     * @default none
     */
    export let bootstrap: "" | BootstrapIconsType = "";
    /**
     * Material icon name.
     * @default none
     */
    export let material: "" | MaterialIconsType = "";
    /**
     * Material icon type. Used only if material icon is set.
     * @default "filled"
     */
    export let materialType: "filled" | "outlined" | "round" | "sharp" | "two-tone" = "filled";

    $: {
        let classes = "";
        if (material) {
            classes =
                materialType == "filled" ? "material-icons" : "material-icons-" + materialType;
        }
        if (bootstrap) {
            classes = classes ? " " : "" + "bi-" + bootstrap;
        }
        if (classes) {
            $$restProps.class = ($$restProps.class ? $$restProps.class.trim() + " " : "") + classes;
        }
    }
</script>

<svelte:element this={element} {...$$restProps}>{material ?? ""}</svelte:element>
