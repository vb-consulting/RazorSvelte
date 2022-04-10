<script lang="ts">
    import { onDestroy, createEventDispatcher } from "svelte"
    import modal from "bootstrap/js/dist/modal";
    import type ModalOptions from "./modal";

    export let options: ModalOptions;

    const dispatch = createEventDispatcher();
    let dialog: modal | null;
    let element: HTMLElement;

    function useModal(e: HTMLElement) {
        element = e;
        dialog = new modal(e, options.options ? options.options : {backdrop: true, focus: true, keyboard: true});
        element.addEventListener("show.bs.modal", event => dispatch("show", event));
        element.addEventListener("shown.bs.modal", event => dispatch("shown", event));
        element.addEventListener("hide.bs.modal", event => dispatch("hide", event));
        element.addEventListener("hidden.bs.modal", event => dispatch("hidden", event));
        element.addEventListener("hidePrevented.bs.modal", event => dispatch("hidePrevented", event));
    }

    function closeDlg() {
        options.open = false;
    }

    onDestroy(() => {
        if (dialog) {
            element.removeEventListener("show.bs.modal", event => dispatch("show", event));
            element.removeEventListener("shown.bs.modal", event => dispatch("shown", event));
            element.removeEventListener("hide.bs.modal", event => dispatch("hide", event));
            element.removeEventListener("hidden.bs.modal", event => dispatch("hidden", event));
            element.removeEventListener("hidePrevented.bs.modal", event => dispatch("hidePrevented", event));
            dialog.dispose();
            dialog = null;
        }
    });

    $: {
        if (dialog && options) {
            if (options.open) {
                dialog.show();
            }
            else {
                dialog.hide();
            }
        }
    }
</script>

<div class="modal {options.noAnimation ? "" : "fade"}" tabindex="-1" use:useModal>
    <div class="modal-dialog {options.classes ? options.classes : ""}"
    class:modal-dialog-scrollable={options.scrollable} 
    class:modal-fullscreen={options.fullscreen}
    class:modal-dialog-centered={options.centered}
    class:modal-sm={options.small}
    class:modal-lg={options.large}
    class:modal-xl={options.extraLarge}>
        <div class="modal-content">
            {#if options.title || options.titleCloseButton || $$slots.title}
                <div class="modal-header">
                    <h5 class="modal-title">
                        {#if options.title}
                            {@html options.title}
                        {/if}
                        <slot name="title"></slot>
                    </h5>
                    {#if options.titleCloseButton}
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={closeDlg}></button>
                    {/if}
                </div>
            {/if}
            <div class="modal-body">
                {#if options.open}
                    {#if options.promise}
                        {#await options.promise()}
                            <div class="text-center">
                                <i class="spinner-border" style="width: 3rem; height: 3rem;"></i>
                            </div>
                        {:then content}
                            {@html content}
                        {/await}
                    {/if}
                    {#if options.content}
                        {@html options.content}
                    {/if}
                    <slot></slot>
                {/if}
            </div>
            {#if options.closeBtn || (options.buttons && options.buttons.length) || $$slots.footer || options.footer}
                <div class="modal-footer">
                    {#if options.closeBtn}
                        <button class="btn btn-secondary" data-bs-dismiss="modal" on:click={() => closeDlg}>Close</button>
                    {/if}
                    {#if options.footer}
                        {@html options.footer}
                    {/if}
                    <slot name="footer"></slot>
                    {#if options.buttons && options.buttons.length}
                        {#each options.buttons as button}
                            <button class="btn {button.classes ? button.classes : "btn-primary"}" on:click={() => button.click()}>{button.text}</button>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
