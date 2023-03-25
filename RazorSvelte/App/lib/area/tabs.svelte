<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";

    interface $$Slots {
        default: { active: string | LinkTabType };
    }

    type LinkTabType = { text: string; href: string };

    export let tabs: string[] | LinkTabType[] = [];
    export let active: string | LinkTabType = tabs.length ? tabs[0] : "";
    export let hashtag = false;
    export let type: TabType = "tabs";
    export let align: VerticalAlignType = "start";
    export let space: EmptySpaceType = "normal";
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

    if (hashtag) {
        const routeChanged = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                if (typeof tabs[0] == "string") {
                    if ((tabs as string[]).indexOf(hash)) {
                        active = hash;
                    }
                } else {
                    active = (tabs as LinkTabType[]).find((t) => t.text == hash) ?? "";
                }
            }
        };
        window.addEventListener("hashchange", routeChanged, false);
        routeChanged();
        onDestroy(() => {
            window.removeEventListener("hashchange", routeChanged);
        });
    }

    const dispatch = createEventDispatcher();

    function tabSwitch(tab: string | LinkTabType) {
        active = tab;
        if (hashtag) {
            if (typeof tab == "string") {
                window.location.hash = tab;
            } else {
                window.location.hash = tab.text;
            }
        }
        dispatch("change", { active });
    }

    $: ulClass = `nav nav-${type} ${space == "normal" ? "" : "nav-" + space} ${
        align == "start" ? "" : "justify-content-" + align
    } ${classes || ""}`.trim();

    dispatch("change", { active });
</script>

<ul class={ulClass} style={styles || ""}>
    {#each tabs as tab}
        <li class="nav-item">
            {#if typeof tab == "string"}
                <div
                    class="nav-link"
                    class:active={active == tab}
                    on:click={() => tabSwitch(tab)}
                    on:keydown={() => tabSwitch(tab)}>
                    {tab}
                </div>
            {:else}
                <a
                    href={tab.href}
                    class="nav-link"
                    class:active={active == tab}
                    on:click={() => tabSwitch(tab)}
                    on:keydown={() => tabSwitch(tab)}>
                    {tab.text}
                </a>
            {/if}
        </li>
    {/each}
</ul>

<slot {active} />

<style lang="scss">
    .nav-link:not(.active) {
        cursor: pointer;
    }
    .nav-link.active {
        cursor: default;
        user-select: none;
    }
</style>
