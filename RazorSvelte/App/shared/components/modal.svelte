<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte"
    import modal from "bootstrap/js/dist/modal";

    interface ModalButton {
        /**
         * Button text
         * 
         * @default undefined
         */
        text: string;
        /**
         * Button click handler
         * 
         * @default undefined
         */
        click: () => void;
        /**
         * Extra classes. If not defined, default class is btn-primary
         * 
         * @default undefined
         */
        classes?: string;
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
    export let state = {open: false};
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
     * Default animation class on modal div. Set to empty string to have your modal just appear like that out of nowhere.
     * 
     * @default "fade"
     */
    export let animation = "fade";
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
     * List of extra classes space-separated added to the modal-dialog element
     * 
     * @default undefined
     */
    export let classes: string | undefined = undefined;
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
    export let promise: (() => Promise<string>) | undefined = undefined;
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
    export let buttons: ModalButton[] | undefined = undefined;


    const dispatch = createEventDispatcher();
    let instance: modal | null;
    let element: HTMLElement;

    function useElement(e: HTMLElement) {
        element = e;
        instance = new modal(e, {backdrop, focus, keyboard});
        element.addEventListener("show.bs.modal", event => dispatch("show", event));
        element.addEventListener("shown.bs.modal", event => dispatch("shown", event));
        element.addEventListener("hide.bs.modal", event => dispatch("hide", event));
        element.addEventListener("hidden.bs.modal", event => {
            state.open = false;
            dispatch("hidden", event);
        });
        element.addEventListener("hidePrevented.bs.modal", event => dispatch("hidePrevented", event));
    }

    function close() {
        state.open = false;
    }

    onDestroy(() => {
        if (instance) {
            element.removeEventListener("show.bs.modal", event => dispatch("show", event));
            element.removeEventListener("shown.bs.modal", event => dispatch("shown", event));
            element.removeEventListener("hide.bs.modal", event => dispatch("hide", event));
            element.removeEventListener("hidden.bs.modal", event => dispatch("hidden", event));
            element.removeEventListener("hidePrevented.bs.modal", event => dispatch("hidePrevented", event));
            instance.dispose();
            instance = null;
        }
    });

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

<div class="modal {animation ? animation : ""}" tabindex="-1" use:useElement>
    <div class="modal-dialog {classes ? classes : ""}"
    class:modal-dialog-scrollable={scrollable} 
    class:modal-fullscreen={fullscreen}
    class:modal-dialog-centered={centered}
    class:modal-sm={small}
    class:modal-lg={large}
    class:modal-xl={extraLarge}>
        <div class="modal-content">
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
