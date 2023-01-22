<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte"
    import offcanvas from "bootstrap/js/dist/offcanvas";
    
    interface $$Slots {
        title: { };
        default: { };
    }

    /**
     * Apply a backdrop on body while offcanvas is open
     *
     * @default true
     */
    export let backdrop = true;
    /**
     * Closes the offcanvas when escape key is pressed
     *
     * @default true
     */
    export let keyboard = true;
    /**
     * Allow body scrolling while offcanvas is open
     *
     * @default false
     */
    export let scroll = true;
    /**
     * Offcanvas state instance. Only prop is dialog open?
     *
     * @default {open: false}
     */
    export let state: IComponentState = {open: false};
    /**
     * Offcanvas Orientation (start, end, top, bottom)
     *
     * @default start
     */
    export let orientation: ScreenOrientationType = "start";
    /*
    * Responsive offcanvas size class
    */
    export let responsiveSize: SizeType | undefined = undefined;
    /**
     * Text in title. Can also be set by named slot "title".
     * If title is not set and titleCloseButton is false, title will not be shown.
     *
     * @default undefined
     */
    export let title: string | undefined = undefined;
    /**
     * Adds a small close button in title right corner
     *
     * @default false
     */
    export let titleCloseButton = false;
    /**
     * Promise to get content string. Useful when fetching content from a remote file.
     * 
     * @default undefined
     */
    export let promise: PromiseString = undefined;
    /**
     * Content string. Can also be set by unnamed slot.
     * 
     * @default undefined
     */
    export let content: string | undefined = undefined;
    /**
     * Use element action function that are called when an element is created. 
     * They can return an object with a destroy method that is called after the element is unmounted.
     * 
     * @default undefined
     */
    export let use: UseCallbackType = undefined;
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
    
    const dispatch = createEventDispatcher();
    const show = (event: Event) => dispatch("show", event);
    const shown = (event: Event) => dispatch("shown", event);
    const hide = (event: Event) => dispatch("hide", event);
    const hidden = (event: Event) => {
        state.open = false;
        dispatch("hidden", event);
    };

    let instance: offcanvas | null;
    let element: HTMLElement;

    const destroy = () => {
        if (instance) {
            element.removeEventListener("show.bs.offcanvas", show, true);
            element.removeEventListener("shown.bs.offcanvas", shown, true);
            element.removeEventListener("hide.bs.offcanvas", hide, true);
            element.removeEventListener("hidden.bs.offcanvas", hidden, true);
            instance.dispose();
            instance = null;
        }
    }

    onDestroy(destroy);
    
    function useElement(e: HTMLElement) {
        element = e;
        instance = new offcanvas(e, {backdrop, keyboard, scroll});
        element.addEventListener("show.bs.offcanvas", show, true);
        element.addEventListener("shown.bs.offcanvas", shown, true);
        element.addEventListener("hide.bs.offcanvas", hide, true);
        element.addEventListener("hidden.bs.offcanvas", hidden, true);
        let result: any;
        if (use) {
            result = use(e);
        }
        return {
            destroy() {
                destroy();
                result?.destroy();
            },
            update() {
                result?.update();
            }
        };
    }

    function close() {
        state.open = false;
    }

    $: {
        if (instance) {
            if (state.open) {
                instance.show();
                (element as HTMLElement).focus();
            }
            else {
                instance.hide();
            }
        }
    }
</script>

<div class="{responsiveSize ? `offcanvas-${responsiveSize}` : "offcanvas"} offcanvas-{orientation} {classes || ''}" style="{styles || ''}" tabindex="-1" use:useElement>
    {#if title || titleCloseButton || $$slots.title}
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">
                {#if title}
                    {@html title}
                {/if}
                <slot name="title"></slot>
            </h5>
            {#if titleCloseButton}
            <button type="button" class="btn-close text-reset" on:click={close}></button>
            {/if}
        </div>
    {/if}
    <div class="offcanvas-body">
        {#if state.open}
            {#if promise}
                {#await promise()}
                    <div class="text-center">
                        <i class="spinner-border" style="width: 3rem; height: 3rem;"></i>
                    </div>
                {:then content}
                    {@html content}
                {/await}
            {/if}
            {#if content}
                {@html content}
            {/if}
            <slot></slot>
        {/if}
    </div>
</div>

<style lang="scss">
</style>