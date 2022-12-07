<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte";
    import modal from "bootstrap/js/dist/modal";

    interface $$Slots {
        header: { };
        title: { };
        footer: { };
        default: { };
    }

    /**
     * Includes a modal-backdrop element. Alternatively, specify static for
     * a backdrop which doesn't close the modal on click.
     *
     * @default true
     */
    export let backdrop = true;
    /**
     * Puts the focus on the modal when initialized.
     *
     * @default true
     */
    export let focus = true;
    /**
     * Closes the modal when escape key is pressed
     *
     * @default true
     */
    export let keyboard = true;
    /**
     * Dialog state instance. Only prop is dialog open?
     *
     * @default {open: false}
     */
    export let state: IComponentState = {open: false};
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
     * Footer content (buttons area). Can also be set by named slot "footer".
     * If footer is not set and buttons are defined, footer will not be shown.
     * 
     * @default undefined
     */
    export let footer: string | undefined = undefined;
    /**
     * Adds default animation class "fade" on modal div. Set to false to disable modal fade animation..
     * 
     * @default "fade"
     */
    export let fade = true;
    /**
     * Content is scrollable
     * 
     * @default false
     */
    export let scrollable = false;
    /**
     * Content is centered
     * 
     * @default true
     */
    export let centered = true;
    /**
     * Modal is fullscreen
     * 
     * @default false
     */
    export let fullscreen = false;
    /**
     * Modal is large
     * 
     * @default false
     */
    export let large = false;
    /**
     * Modal is extra large
     * 
     * @default false
     */
    export let extraLarge = false;
    /**
     * Modal is small
     * 
     * @default false
     */
    export let small = false;
    /**
     * Adds close button to footer which, well, closes the dialog
     * 
     * @default false
     */
    export let closeBtn = false;
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
     * List of footer buttons
     * 
     * @default undefined
     */
    export let buttons: IModalButton[] | undefined = undefined;
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
    const hidePrevented = (event: Event) => dispatch("hidePrevented", event);

    let instance: modal | null;
    let element: HTMLElement;

    const destroy = () => {
        if (instance) {
            element.removeEventListener("show.bs.modal", show, true);
            element.removeEventListener("shown.bs.modal", shown, true);
            element.removeEventListener("hide.bs.modal", hide, true);
            element.removeEventListener("hidden.bs.modal", hidden, true);
            element.removeEventListener("hidePrevented.bs.modal", hidePrevented, true);
            instance.dispose();
            instance = null;
        }
    }

    onDestroy(destroy);

    function useElement(e: HTMLElement) {
        element = e;
        instance = new modal(e, {backdrop, focus, keyboard});
        element.addEventListener("show.bs.modal", show, true);
        element.addEventListener("shown.bs.modal", shown, true);
        element.addEventListener("hide.bs.modal", hide, true);
        element.addEventListener("hidden.bs.modal", hidden, true);
        element.addEventListener("hidePrevented.bs.modal", hidePrevented, true);
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
            }
            else {
                instance.hide();
            }
        }
    }
</script>

<div class="modal" class:fade={fade} tabindex="-1" use:useElement>
    <div class="modal-dialog {classes || ''}" style="{styles || ''}"
    class:modal-dialog-scrollable={scrollable} 
    class:modal-fullscreen={fullscreen}
    class:modal-dialog-centered={centered}
    class:modal-sm={small}
    class:modal-lg={large}
    class:modal-xl={extraLarge}>
        <div class="modal-content">
            {#if $$slots.header}
                <slot name="header"></slot>
            {/if}
            {#if title || titleCloseButton || $$slots.title}
                <div class="modal-header">
                    <h5 class="modal-title">
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
            <div class="modal-body">
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
            {#if closeBtn || (buttons && buttons.length) || $$slots.footer || footer}
                <div class="modal-footer">
                    {#if closeBtn}
                        <button class="btn btn-secondary" data-bs-dismiss="modal" on:click={() => close}>Close</button>
                    {/if}
                    {#if footer}
                        {@html footer}
                    {/if}
                    <slot name="footer"></slot>
                    {#if buttons && buttons.length}
                        {#each buttons as button}
                            <button class="btn {button.classes ? button.classes : "btn-primary"}" on:click={() => button.click()}>{button.text}</button>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
</style>