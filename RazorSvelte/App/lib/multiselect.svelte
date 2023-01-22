<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import Placeholder from "./placeholder.svelte";
    import { hideTooltips } from "./tooltips"
    import { mark, generateId } from "./utils";

    type T = $$Generic;
    type TItem = T & IValueName;

    interface $$Slots {
        token: { item: TItem };
        option: { item: TItem, markup: string };
    }

    export let id: string = "ms-" + generateId().toLowerCase();
    export let placeholder = "";
    export let searchFunc: (request: IMultiselectRequest) => Promise<IPagedResponse<T>>;
    export let selected: TItem[] = [];
    export let autoShow = true;
    export let limit = 200;
    export let page = 50;
    export let count: number = 0;
    export let small: boolean = false;
    export let large: boolean = false;
    export let searching: boolean = false;
    export let initialized: boolean = true;
    export let searchTimeoutMs = 500;
    export let tokenColorTheme: ColorThemeType = "primary";
    export const instance: IMultiselect<TItem> = {
        selected,
        getSelectedKeys: () => Object.keys(selectedKeys),
        toggleItem: (item: TItem) => {
            if (containsKey(item.value)) {
                removeSelectedByValue(item.value);
                return false;
            }
            addSelected(item);
            return true;
        },
        containsKey: (key: any) => containsKey(key)
    }
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

    let selectedKeys: Record<any, boolean> = 
        !selected || !selected.lastIndexOf ? {} : 
        Object.assign({}, ...selected.map(s => ({[s.value]: true})));

    let input: HTMLInputElement;
    let inputValue: string;
    let list: HTMLUListElement;

    let activeIdx: number | undefined; 
    let options: TItem[];
    let showOptions = false;
    let focused: boolean;
    let lastQuery: string;
    let offset = 0;

    let searchTimeout: NodeJS.Timeout | undefined;
    let scrollTimeout: NodeJS.Timeout | undefined;
    const scrollTimeoutMs = 500;
    const dispatch = createEventDispatcher();

    const listItemId = (index: number) => `${id}-opt-${index}`;

    const getListDimensions = () => {
        const itemHeight = (list.firstChild as Element).clientHeight;
        const listHeight = list.clientHeight;
        return {
            itemHeight,
            listHeight,
            itemsOnScreen: Math.round(listHeight / itemHeight)
        }
    };
    const load = async () => {
        const query = inputValue ?? "";
        offset = 0;
        searching = true;
        options = [];
        const response = await searchFunc({search: query, limit, offset});
        options = response.page as TItem[];
        count = response.count;
        searching = false;
        activeIdx = undefined;
        lastQuery = query;
    }

    function search() {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
        searchTimeout = setTimeout(() => {
            searchTimeout = undefined;
            if (searching) {
                search();
            } else {
                load();
            }
        }, searchTimeoutMs);
        if (!showOptions) {
            optionsVisibility(true);
        }
    }

    function addSelected(token: IValueName) {
        if (token) {
            selected = [...selected, token as TItem];
            selectedKeys[token.value] = true;
            hideTooltips();
            dispatch("change", {keys: Object.keys(selectedKeys), values: selected});
        }
    }

    function removeSelectedByValue(value: any) {
        selected = selected.filter(s => (s as IValueName).value != value);
        delete selectedKeys[value];
        selectedKeys = selectedKeys;
        hideTooltips();
        dispatch("change", {keys: Object.keys(selectedKeys), values: selected});
    }

    function clearAllSelected() {
        selected = [];
        selectedKeys = {};
        hideTooltips();
        dispatch("change", {keys: Object.keys(selectedKeys), values: selected});
    }

    function containsKey(key: any) {
        return !!selectedKeys[key];
    }

    function optionsVisibility(show: boolean) {
        showOptions = show;
        if (show && !options && !searching) {
            load();
        }
    }

    function handleKey(e: KeyboardEvent) {
        if (searching) {
            return;
        }

        if (!showOptions) {
            if (["Enter", "ArrowUp", "ArrowDown"].includes(e.code)) {
                optionsVisibility(true);
            }
            return;
        }

        if (e.code == "Backspace" && !inputValue && hasSelected) {
            removeSelectedByValue((selected[selected.length-1] as IValueName).value);
            return;
        }

        if (e.code == "Escape") {
            optionsVisibility(false);
            return;
        }

        if (e.code == "Enter" || e.code == "Space") {
            if (activeIdx != undefined) {
                let activeOption = options[activeIdx] as IValueName;
                if (activeOption) {
                    if (containsKey(activeOption.value)) {
                        removeSelectedByValue(activeOption.value);
                    } else {
                        addSelected(activeOption);
                    }
                    e.preventDefault();
                }
            }
            return;
        }

        const 
            arrowUp = e.code == "ArrowUp", 
            pageUp = e.code == "PageUp",
            arrowDown = e.code == "ArrowDown", 
            pageDown = e.code == "PageDown";

        if (arrowDown || pageDown || arrowUp || pageUp) {

            let 
                idx = activeIdx, 
                len = options.length;
            const itemsOnScreen = getListDimensions().itemsOnScreen;

            if (arrowDown || pageDown) {
                if (idx == len - 1) {
                    return;
                }
                idx = idx == undefined ? 0 : idx + (pageDown ? itemsOnScreen : 1);
                if (idx > len - 1) {
                    idx = len - 1;
                }
            }
            if (arrowUp || pageUp) {
                if (idx == 0) {
                    return;
                }
                idx = idx == undefined ? len - 1 : idx - (pageUp ? itemsOnScreen : 1);
                if (idx < 0) {
                    idx = 0;
                }
            }

            if (idx != activeIdx) {
                activeIdx = idx;
                listScroll(true).then(() => {
                    let result = list.querySelectorAll(`#${listItemId(activeIdx as number)}`);
                    if (result.length) {
                        result[0].scrollIntoView({block: "nearest"});
                    }
                });
            }
        }
    }

    function handleOptionMousedown(e: MouseEvent) {
        const li = (e.target as any).closest("li") as HTMLLIElement;
        if (!li) {
            return
        }
        const value = li.dataset.value;
        if (!value) {
            return
        }
        if (containsKey(value)) {
            removeSelectedByValue(value);
        } else {
            addSelected((options as IValueName[]).filter(o => o.value == value)[0]);
            input.focus();
        }
    }

    function inputBlur(e: FocusEvent) {
        focused = false;
        setTimeout(() => {
            optionsVisibility(false);
        }, 250);
    }

    function inputFocus() {
        focused = true;
        if (autoShow) {
            optionsVisibility(true);
        }
        input.select();
    }

    async function listScroll(immidiate = false) {
        if (!options || !options.length) {
            return;
        }
        const {itemHeight, listHeight, itemsOnScreen} = getListDimensions();
        const higherTreshold = (itemsOnScreen / 2) * itemHeight;
        const lowerTreshold = (options.length * itemHeight) - listHeight - higherTreshold;

        const doScroll = async (offsetFunc: () => number, optionsFunc: (response: IPagedResponse<T>) => T[]) => {
            const scroll = async () => {
                offset = offsetFunc();
                const query = inputValue ?? "";
                searching = true;
                const response = await searchFunc({search: query, limit, offset});
                options = optionsFunc(response) as TItem[];
                searching = false;
            };
            if (immidiate) {
                scroll();
            } else {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = undefined;
                }
                scrollTimeout = setTimeout(async () => {
                    scrollTimeout = undefined;
                    await scroll();
                }, scrollTimeoutMs);
            }
        }

        if (list.scrollTop < higherTreshold && offset > 0) {
            await doScroll(
                () => offset - page < 0 ? 0 : offset - page, 
                response => [...response.page, ...options.slice(0, options.length - page) as T[]]
            );
        }

        if (list.scrollTop >= lowerTreshold && (offset + limit <= count)) {
            await doScroll(
                () => offset + page, 
                response => [...options.slice(page, options.length) as T[], ...response.page]
            );
        }
    }

    function iconClick() {
        if (!searching && hasSelected) {
            clearAllSelected();
        } 
        input.focus();
        hideTooltips();
    }

    function handleTokenClick(e: MouseEvent, item: IValueName) {
        removeSelectedByValue(item.value);
    }

    function handleCaretClick() {
        if (showOptions) {
            optionsVisibility(false);
        } else {
            input.focus();
        }
    }

    $: hasSelected = selected.length;
</script>

{#if !initialized}
    <Placeholder class="{classes || ''}" style="{styles || ''}" height={(large ? "50px" : (small ? "32px" : "38px"))} />
{:else}
    <div class="multiselect {classes || ''}" style="{styles || ''}" class:input-group-sm={small} class:input-group-lg={large}>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span 
            class="multiselect-icon {searching ? "spinner-border" : (hasSelected ? "bi-x-circle" : "bi-search")}" 
            on:click={() => iconClick()} 
            data-bs-toggle="tooltip"
            title="{searching ? "Loading..." : (hasSelected ? "Clear All" : (placeholder || "Search"))}">
        </span>

        <div class="tokens form-control" class:focused class:showOptions style="{hasSelected ? "padding-left: 25px" : ""}">
            {#each selected as item}
                <button class="clickable-token {tokenColorTheme == "none" ? "" : "text-bg-" + tokenColorTheme}" 
                    disabled={searching}
                    data-bs-toggle="tooltip"
                    title="click to remove '{item["name"]}'" 
                    on:click={e => handleTokenClick(e, item)}>
                    {#if $$slots.token}
                        <slot name="token" {item}></slot>
                    {:else}
                        <span>{item.name}</span>
                    {/if}
                </button>
            {/each}
            <div class="actions">
                <input 
                    id={id} 
                    name={id} 
                    style="{hasSelected ? "" : "text-indent: 18px"}"
                    class:ms-1={hasSelected}
                    autocomplete={id}
                    autocorrect="off"
                    spellcheck="false"
                    type="text"
                    bind:value={inputValue} 
                    bind:this={input} 
                    on:keydown={handleKey} 
                    on:blur={inputBlur} 
                    on:focus={inputFocus} 
                    on:input={search}
                    placeholder={placeholder} />
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span class="dropdown-arrow {showOptions ? "bi-caret-up" : "bi-caret-down"}" on:click={handleCaretClick}></span>
            </div>
        </div>

        {#if options}
            <div class="options shadow-lg">
                <ul bind:this={list} 
                    class:d-none={!showOptions} 
                    transition:fly="{{duration: 200, y: 5}}" 
                    on:mousedown|preventDefault={handleOptionMousedown}
                    on:scroll={() => listScroll()}>
                    {#each options as option, index}
                        {#if option.value == null || option.name == null}
                        <li>
                            <hr />
                        </li>
                        {:else}
                        <li id="{listItemId(index)}" class="option" class:selected={selectedKeys[option.value]} class:active={activeIdx == index} data-value="{option.value}">
                            {#if $$slots.option}
                                <slot name="option" item={option} markup={mark(option.name, lastQuery, `<span class="search-mark ${selectedKeys[option.value] ? "active" : ""}">`, "</span>")}></slot>
                            {:else}
                                {@html mark(option.name, lastQuery, `<span class="search-mark ${selectedKeys[option.value] ? "active" : ""}">`, "</span>")}
                            {/if}
                        </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    $multiselect-dark-theme-input-color: var(--bs-white);
    $multiselect-option-item-background-color: var(--bs-body-bg);
    $multiselect-option-selected-item-background-color: var(--bs-primary);
    $multiselect-option-selected-item-color: var(--bs-body-bg);
    $multiselect-option-active-item-border-color: var(--bs-primary);
    $multiselect-option-active-selected-item-border-color: var(--bs-body-bg);
    
    .multiselect {
        position: relative;
        display: flex;

        & > .multiselect-icon {
            position: absolute;
            cursor: pointer;
            margin-left: 8px;
            z-index: 1;
            align-self: center;
        }
        & > .spinner-border {
            width: 16px;
            height: 16px;
            opacity: 0.5;
        }
        & .tokens {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            position: relative;
        }
        & .actions {
            align-items: center;
            display: flex;
            flex: 1;
            min-width: 15rem;
            & > .dropdown-arrow {
                cursor: pointer;
            }
        }
        & input {
            border: none;
            margin: 0;
            outline: none;
            padding: 0;
            width: 100%;
            background-color: transparent;
        }

        & .options {
            left: 0;
            max-height: 70vh;
            position: absolute;
            top: calc(100% + 1px);
            width: 100%;

            & > ul {
                z-index: 3;
                position: relative;
                list-style: none;
                padding-inline-start: 0;
                overflow: auto;
                max-height: 60vh;
                margin-bottom: 0;
                & > li {
                    background-color: $multiselect-option-item-background-color;
                    filter: brightness(98%);
                    & > hr {
                        margin: initial;
                    }
                }
                & > li.option {
                    cursor: pointer;
                    padding: .5rem;
                }
                & > li.option:hover {
                    filter: brightness(90%);
                }
                & > li.option.active {
                    border: 1px dotted $multiselect-option-active-item-border-color;
                }
                & > li.option.active.selected {
                    border: 1px dotted $multiselect-option-active-selected-item-border-color;
                }
                & > li.option.selected {
                    background-color: $multiselect-option-selected-item-background-color;
                    color: $multiselect-option-selected-item-color;
                }
            }
        }
    }

    body.dark .multiselect {
        & input {
            color: $multiselect-dark-theme-input-color;
        }
    }
</style>
