<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import Popover from "bootstrap/js/dist/popover";

    interface $$Slots {
        /**
         * Default element to show inside the popover defined in a default slot.
         */
        default: {};
        /**
         * Title element to show inside the popover defined in a title slot.
         */
        title: {};
    }
    /**
     * The element to attach the popover to. It can be a selector or an element. If not specified, the previous sibling element will be used.
     * @default The previous sibling element
     */
    export let element: string | Element = "";
    /**
     * Default content value if slot content isn't present.
     *
     * If a function is given, it will be called with its this reference set
     * to the element that the popover is attached to.
     *
     * @default ''
     */
    export let content: string | Element | ((this: HTMLElement) => string | Element) = "";
    /**
     * Default title value if title attribute isn't present.
     *
     * If a function is given, it will be called with its this reference set
     * to the element that the popover is attached to.
     *
     * @default ''
     */
    export let title: string | Element | ((this: HTMLElement) => string | Element) = "";
    /**
     * How tooltip is triggered - click | hover | focus | manual. You may
     * pass multiple triggers; separate them with a space.
     *
     * 'manual' indicates that the tooltip will be triggered
     * programmatically via the .tooltip('show'), .tooltip('hide') and
     * .tooltip('toggle') methods; this value cannot be combined with any
     * other trigger.
     *
     * 'hover' on its own will result in tooltips that cannot be triggered
     * via the keyboard, and should only be used if alternative methods for
     * conveying the same information for keyboard users is present.
     *
     * @default 'hover focus'
     */
    export let trigger:
        | "click"
        | "hover"
        | "focus"
        | "manual"
        | "click hover"
        | "click focus"
        | "hover focus"
        | "click hover focus" = "hover focus";
    /**
     * How to position the popover - auto | top | bottom | left | right.
     * When auto is specified, it will dynamically reorient the popover.
     *
     * When a function is used to determine the placement, it is called with
     * the popover DOM node as its first argument and the triggering element
     * DOM node as its second. The this context is set to the popover
     * instance.
     *
     * @default 'top'
     */
    export let placement: PopoverPlacement | (() => PopoverPlacement) = "top";

    type PopoverPlacement = "auto" | "top" | "bottom" | "left" | "right";

    let popover: Popover;
    let contentWrapper: HTMLSpanElement;
    let titleWrapper: HTMLSpanElement;

    function show() {
        if (contentWrapper && contentWrapper.style.display == "none") {
            contentWrapper.style.display = "";
        }
        if (titleWrapper && titleWrapper.style.display == "none") {
            titleWrapper.style.display = "";
        }
    }

    onMount(() => {
        if (contentWrapper.firstChild && content) {
            console.warn(
                "Popover content is ignored when using a slot. Element: ",
                contentWrapper.firstChild
            );
        }
        if (titleWrapper.firstChild && title) {
            console.warn(
                "Popover title is ignored when using a title slot. Element: ",
                titleWrapper.firstChild
            );
        }

        if (contentWrapper.firstChild) {
            popover = new Popover(element || (contentWrapper.previousElementSibling as Element), {
                title: (titleWrapper.firstChild || title) as Element,
                trigger: trigger,
                placement: placement,
                html: true,
                content: contentWrapper
            });
            ((popover as any)._element as Element).addEventListener("show.bs.popover", show);
        } else {
            popover = new Popover(
                element || ((contentWrapper && contentWrapper.previousElementSibling) as Element),
                {
                    title: title,
                    trigger: trigger,
                    placement: placement,
                    html: typeof content != "string",
                    content: content
                }
            );
        }
    });

    onDestroy(() => {
        if (popover) {
            ((popover as any)._element as Element).addEventListener("show.bs.popover", show);
            popover.dispose();
        }
    });
</script>

<span bind:this={contentWrapper} style="display: none"><slot /></span>
<span bind:this={titleWrapper} style="display: none"><slot name="title" /></span>
