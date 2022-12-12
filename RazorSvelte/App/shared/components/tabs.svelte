<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";

    interface $$Slots {
        default: { active: string };
    }

    export let tabs: string[];
    export let active: string = tabs.length ? tabs[0] : "";
    export let hashtag = false;
    export let type: TabType = "tabs";
    export let align: VerticalAlignType = "start";
    export let space : EmptySpaceType = "normal";
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
            if (hash && tabs.indexOf(hash)) {
                active = hash;
            }
        };
        window.addEventListener("hashchange", routeChanged, false);
        routeChanged();
        onDestroy(() => {
            window.removeEventListener("hashchange", routeChanged);
        });
    }

    const dispatch = createEventDispatcher();

    function tabSwitch(tab: string) {
        active = tab;
        if (hashtag) {
            window.location.hash = tab;
        }
        dispatch("change", {active});
    }

    dispatch("change", {active});
</script>

<ul class="nav nav-{type} {(space == "normal" ? "" : "nav-" + space)} {align == "start" ? "" : "justify-content-" + align} {classes || ''}" style="{styles || ''}">
    {#each tabs as tab}
        <li class="nav-item">
            <div class="nav-link" class:active={active == tab} on:click={() => tabSwitch(tab)} on:keydown={() => tabSwitch(tab)}>{tab}</div>
        </li>
    {/each}
</ul>

<slot active={active}></slot>

<style lang="scss">
    .nav-link:not(.active) {
        cursor: pointer;
    }
    .nav-link.active {
        cursor: default;
        user-select: none;
    }
</style> 
