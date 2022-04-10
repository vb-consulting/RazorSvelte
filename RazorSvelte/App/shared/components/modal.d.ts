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

export default interface ModalOptions {
    /**
     * Default modal settings defined by bootstrap: 
     * https://getbootstrap.com/docs/5.1/components/modal/#options
     *
     * @default {backdrop: true, focus: true, keyboard: true}
     */
    options?: modal.Options;
    /**
     * Dialog is open?
     * This can be set as individual prop
     *
     * @default false
     */
    open?: boolean;
    /**
     * Text in title. Can also be set by named slot "title".
     * If title is not set and titleCloseButton is false, title will not be shown.
     *
     * @default undefined
     */
    title?: string;
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
    footer?: string;
    /**
     * If set to true fade class is not added and show/hide won't animate for this dialog. 
     * Just appears like that
     * 
     * @default false
     */
    noAnimation?: boolean;
    /**
     * Content is scrollable
     * 
     * @default false
     */
    scrollable?: boolean;
    /**
     * Content is centered
     * 
     * @default false
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
    /**
     * List of extra classes space-separated added to the modal-dialog element
     * 
     * @default undefined
     */
    classes?: string;
    /**
     * Adds close button to footer which, well, closes the dialog
     * 
     * @default false
     */
    closeBtn?: boolean;
    /**
     * Promise to get content string. Useful when fetching content from a remote file.
     * 
     * @default undefined
     */
    promise?: () => Promise<string>;
    /**
     * Content string. Can also be set by unnamed slot.
     * 
     * @default undefined
     */
    content?: string;
    /**
     * List of footer buttons
     * 
     * @default undefined
     */
    buttons?: ModalButton[];
}
