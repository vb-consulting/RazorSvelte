<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte"
    import offcanvas from "bootstrap/js/dist/offcanvas";

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
    export let state = {open: false};
    /**
     * Offcanvas Orientation (start, end, top, bottom)
     *
     * @default start
     */
    export let orientation: "start"|"end"|"top"|"bottom" = "start";
    /**
     * List of extra classes space-separated added to the offcanvas element
     * 
     * @default undefined
     */
    export let classes: string | undefined = undefined;
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
    export let promise: (() => Promise<string>) | undefined = undefined;
    /**
     * Content string. Can also be set by unnamed slot.
     * 
     * @default undefined
     */
    export let content: string | undefined = undefined;

    const dispatch = createEventDispatcher();
    let instance: offcanvas | null;
    let element: HTMLElement;

    function useElement(e: HTMLElement) {
        element = e;
        instance = new offcanvas(e, {backdrop, keyboard, scroll});
        element.addEventListener("show.bs.offcanvas", event => dispatch("show", event));
        element.addEventListener("shown.bs.offcanvas", event => dispatch("shown", event));
        element.addEventListener("hide.bs.offcanvas", event => dispatch("hide", event));
        element.addEventListener("hidden.bs.offcanvas", event => {
            state.open = false;
            dispatch("hidden", event);
        });
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
                element.focus();
            }
            else {
                instance.hide();
            }
        }
    }
</script>

<div class="offcanvas offcanvas-{orientation} {classes ? classes : ""}" tabindex="-1" use:useElement>
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
