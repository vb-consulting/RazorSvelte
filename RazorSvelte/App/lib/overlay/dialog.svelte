<script lang="ts" context="module">
    import { writable } from "svelte/store";
    import { sanitize } from "$lib/functions";

    interface IDialog {
        open: boolean;
        content: string;
        buttons: IModalButton[];
        options?: IDialogOptions;
    }

    interface IDialogOptions {
        /**
         * Includes a modal-backdrop element. Alternatively, specify static for
         * a backdrop which doesn't close the modal on click.
         *
         * @default true
         */
        backdrop?: boolean;
        /**
         * Puts the focus on the modal when initialized.
         *
         * @default true
         */
        focus?: boolean;
        /**
         * Closes the modal when escape key is pressed
         *
         * @default true
         */
        keyboard?: boolean;
        /**
         * Text in title. Can also be set by named slot "title".
         * If title is not set and titleCloseButton is false, title will not be shown.
         *
         * @default undefined
         */
        title?: string | undefined;
        /**
         * Adds a small close button in title right corner
         *
         * @default false
         */
        titleCloseButton?: boolean;
        /**
         * Footer content (buttons area). Can also be set by named slot "footer".
         * If footer is not set and buttons are defined, footer will not be shown.
         *
         * @default undefined
         */
        footer?: string | undefined;
        /**
         * Adds default animation class "fade" on modal div. Set to false to disable modal fade animation..
         *
         * @default "fade"
         */
        fade?: boolean;
        /**
         * Content is scrollable
         *
         * @default false
         */
        scrollable?: boolean;
        /**
         * Content is centered
         *
         * @default true
         */
        centered?: boolean;
        /**
         * Modal is fullscreen
         *
         * @default false
         */
        fullscreen?: boolean;
        /**
         * Modal is large
         *
         * @default false
         */
        large?: boolean;
        /**
         * Modal is extra large
         *
         * @default false
         */
        extraLarge?: boolean;
        /**
         * Modal is small
         *
         * @default false
         */
        small?: boolean;
    }

    export const dialog = writable({
        open: false,
        content: "",
        title: undefined,
        buttons: []
    } as IDialog);

    export function openDialog(
        content: string,
        buttons: string[],
        /**
         * Action callback. Return false to prevent dialog from closing.
         */
        action: (action: string) => void | boolean,
        options?: IDialogOptions
    ) {
        const _buttons: IModalButton[] = [];
        const instance = {
            open: true,
            content,
            buttons: _buttons,
            options
        } as IDialog;

        for (let btn of buttons) {
            _buttons.push({
                text: btn,
                click: () => {
                    const result = action(btn);
                    if (result === false) return;
                    instance.open = false;
                    dialog.set(instance);
                }
            });
        }
        dialog.set(instance);
    }
</script>

<script lang="ts">
    import Modal from "$overlay/modal.svelte";
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<Modal bind:open={$dialog.open} buttons={$dialog.buttons} {...$dialog.options}
    >{@html sanitize($dialog.content)}</Modal>

<!-- eslint-enable svelte/no-at-html-tags -->

<style lang="scss">
</style>
