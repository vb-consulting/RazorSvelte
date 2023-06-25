<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import { hideTooltips, createTooltips } from "$element/tooltips";
    import { generateId, mark, sanitize } from "$lib/functions";

    type T = $$Generic;
    type TItem = T & IValueName;

    const dispatch = createEventDispatcher<{
        /**
         * @event triggered on every selection change
         */
        change: IMultiSelectChangeEvent;
    }>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface $$Slots {
        token: { item: TItem };
        option: { item: TItem; markup: string };
    }

    /**
     * A unique id for the input component
     */
    export let id: string = "ms-" + generateId(5);
    /*
     * Placeholder input attribute, text to display when no value is selected
     */
    export let placeholder = "";

    export let searchFunc:
        | ((request: {
              search: string;
              skip: number;
              take: number;
          }) => Promise<{ count: number; page: T[] }>)
        | undefined = undefined;

    /**
     * Select options as an array of strings. Keys and names are the same.
     */
    export let values: string[] | undefined = undefined;
    /**
     * Select options as an array of objects with value and name properties
     */
    export let options: TItem[] | undefined = undefined;
    /**
     * Selected keys as an array of strings
     */
    export let selectedKeys: any[] = [];
    /**
     * Selected items
     */
    export let selected: TItem[] = [];

    export let showOnFocus = true;
    export let limit = 200;
    export let page = 50;
    export let count: number = 0;
    export let small: boolean = false;
    export let large: boolean = false;
    export let searching: boolean = false;
    export let searchTimeoutMs = 500;

    /**
     * The color theme of the tokens
     */
    export let tokenColorTheme: ColorThemeType = "primary";

    export const instance: IMultiselect<TItem> = {
        getSelectedItems: () => selected,
        getSelectedKeys: () => selectedKeys,
        toggleItem: (item: TItem) => {
            if (containsKey(item.value)) {
                removeSelectedByValue(item.value);
                return false;
            }
            addSelected(item);
            return true;
        },
        containsKey: (key: string) => containsKey(key)
    };
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

    let _options: TItem[] = [];

    if (values) {
        _options = values.map((v) => ({ value: v, name: v } as TItem));
    } else if (options) {
        _options = JSON.parse(JSON.stringify(options));
    }
    let initialOptions: TItem[] = JSON.parse(JSON.stringify(_options));

    if (selectedKeys.length) {
        selected = _options.filter((o) => selectedKeys.includes(o.value));
    }

    let selectedRecords: Record<any, boolean> =
        !selected || !selected.lastIndexOf
            ? {}
            : Object.assign({}, ...selected.map((s) => ({ [s.value]: true })));

    let input: HTMLInputElement;
    let inputValue: string;
    let list: HTMLUListElement;

    let activeIdx: number | undefined;

    let showOptions = false;
    let focused: boolean;
    let lastQuery: string;
    let offset = 0;

    let searchTimeout: number | undefined;
    let scrollTimeout: number | undefined;
    const scrollTimeoutMs = 500;

    const listItemId = (index: number) => `${id}-opt-${index}`;

    const getListDimensions = () => {
        const itemHeight = (list.firstChild as Element).clientHeight;
        const listHeight = list.clientHeight;
        return {
            itemHeight,
            listHeight,
            itemsOnScreen: Math.round(listHeight / itemHeight)
        };
    };

    const filterOptions = () => {
        const query = inputValue ?? "";
        if (!query) {
            return;
        }
        const lowerQuery = query.toLowerCase();
        _options = initialOptions.filter((o) => o.name.toLowerCase().includes(lowerQuery));
        lastQuery = query;
    };

    const loadFromDataFunc = async () => {
        if (!searchFunc) {
            return;
        }
        searching = true;
        const query = inputValue ?? "";
        offset = 0;
        _options = [];
        const response = await searchFunc({ search: query, take: limit, skip: offset });
        _options = response.page as TItem[];
        count = response.count;
        activeIdx = undefined;
        lastQuery = query;
        searching = false;
    };

    function search() {
        if (!searchFunc) {
            filterOptions();
            return;
        }
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
        searchTimeout = setTimeout(() => {
            searchTimeout = undefined;
            if (searching) {
                search();
            } else {
                loadFromDataFunc();
            }
        }, searchTimeoutMs);
        if (!showOptions) {
            optionsVisibility(true);
        }
    }

    function addSelected(token: IValueName) {
        if (token) {
            selected = [...selected, token as TItem];
            selectedRecords[token.value] = true;
            recreateTooltips();
            selectedKeys = selected.map((s) => s.value);
            dispatch("change", { keys: selectedKeys, values: selected });
        }
    }

    function removeSelectedByValue(value: any) {
        selected = selected.filter((s) => (s as IValueName).value != value);
        delete selectedRecords[value];
        selectedRecords = selectedRecords;
        selectedKeys = selected.map((s) => s.value);
        dispatch("change", { keys: selectedKeys, values: selected });

        recreateTooltips();
    }

    function clearAllSelected() {
        selected = [];
        selectedRecords = {};
        selectedKeys = selected.map((s) => s.value);
        dispatch("change", { keys: selectedKeys, values: selected });

        recreateTooltips();
    }

    function containsKey(key: any) {
        return !!selectedRecords[key];
    }

    function optionsVisibility(show: boolean) {
        showOptions = show;
        //showOptions = true;
        if (show && !_options && !searching) {
            loadFromDataFunc();
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
            removeSelectedByValue((selected[selected.length - 1] as IValueName).value);
            return;
        }

        if (e.code == "Escape") {
            optionsVisibility(false);
            return;
        }

        if (e.code == "Enter" || e.code == "Space") {
            if (activeIdx != undefined) {
                let activeOption = _options[activeIdx] as IValueName;
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

        const arrowUp = e.code == "ArrowUp",
            pageUp = e.code == "PageUp",
            arrowDown = e.code == "ArrowDown",
            pageDown = e.code == "PageDown";

        if (arrowDown || pageDown || arrowUp || pageUp) {
            let idx = activeIdx,
                len = _options.length;
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
                        result[0].scrollIntoView({ block: "nearest" });
                    }
                });
            }
        }
    }

    function listItemClick(value: any) {
        if (containsKey(value)) {
            removeSelectedByValue(value);
        } else {
            addSelected((_options as IValueName[]).filter((o) => o.value == value)[0]);
            input.focus();
        }
    }

    function inputBlur() {
        focused = false;
        setTimeout(() => {
            optionsVisibility(false);
        }, 250);
    }

    function inputFocus() {
        focused = true;
        if (showOnFocus) {
            optionsVisibility(true);
        }
        input.select();
    }

    async function listScroll(immidiate = false) {
        if (!searchFunc) {
            return;
        }
        if (!_options || !_options.length) {
            return;
        }
        const { itemHeight, listHeight, itemsOnScreen } = getListDimensions();
        const higherTreshold = (itemsOnScreen / 2) * itemHeight;
        const lowerTreshold = _options.length * itemHeight - listHeight - higherTreshold;

        const doScroll = async (
            offsetFunc: () => number,
            optionsFunc: (response: { count: number; page: T[] }) => T[]
        ) => {
            const scroll = async () => {
                if (!searchFunc) {
                    return;
                }
                offset = offsetFunc();
                const query = inputValue ?? "";
                searching = true;
                const response = await searchFunc({ search: query, take: limit, skip: offset });
                _options = optionsFunc(response) as TItem[];
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
        };

        if (list.scrollTop < higherTreshold && offset > 0) {
            await doScroll(
                () => (offset - page < 0 ? 0 : offset - page),
                (response) => [
                    ...response.page,
                    ...(_options.slice(0, _options.length - page) as T[])
                ]
            );
        }

        if (list.scrollTop >= lowerTreshold && offset + limit <= count) {
            await doScroll(
                () => offset + page,
                (response) => [...(_options.slice(page, _options.length) as T[]), ...response.page]
            );
        }
    }

    function iconClick() {
        if (!searching && hasSelected) {
            clearAllSelected();
        }
        input.focus();
        recreateTooltips();
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

    function recreateTooltips() {
        setTimeout(() => {
            hideTooltips();
            createTooltips();
        }, 100);
    }

    $: hasSelected = selected.length;
    $: icontTitle = searching ? "Loading..." : hasSelected ? "Clear All" : placeholder || "Search";

    if (searchFunc && !_options.length) {
        loadFromDataFunc();
    }
</script>

<div
    class="multiselect {classes || ''}"
    style={styles || ""}
    class:input-group-sm={small}
    class:input-group-lg={large}>
    <span
        class="multiselect-icon {searching
            ? 'spinner-border'
            : hasSelected
            ? 'bi-x-circle'
            : 'bi-search'}"
        on:click={iconClick}
        on:keydown={iconClick}
        role="button"
        tabindex="0"
        title={icontTitle} />

    <div
        class="tokens form-control"
        class:focused
        class:showOptions
        style={hasSelected ? "padding-left: 25px" : ""}>
        {#each selected as item}
            <button
                class="btn clickable-token {tokenColorTheme == 'none'
                    ? ''
                    : 'text-bg-' + tokenColorTheme}"
                disabled={searching}
                on:click={(e) => handleTokenClick(e, item)}>
                {#if $$slots.token}
                    <slot name="token" {item} />
                {:else}
                    {item.name}
                {/if}
            </button>
        {/each}
        <div class="actions">
            <input
                {id}
                name={id}
                style={hasSelected ? "" : "text-indent: 18px"}
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
                {placeholder} />

            <span
                class="dropdown-arrow {showOptions ? 'bi-caret-up' : 'bi-caret-down'}"
                on:click={handleCaretClick}
                on:keydown={handleCaretClick}
                role="button"
                tabindex="0" />
        </div>
    </div>

    {#if _options}
        <div class="options shadow-lg">
            <ul
                bind:this={list}
                class="text-start"
                class:d-none={!showOptions}
                transition:fly={{ duration: 200, y: 5 }}
                on:scroll={() => listScroll()}>
                {#each _options as option, index}
                    {#if option.value == null || option.name == null}
                        <li>
                            <hr />
                        </li>
                    {:else}
                        <li
                            id={listItemId(index)}
                            class="option"
                            class:selected={selectedRecords[option.value]}
                            class:active={activeIdx == index}
                            role="presentation"
                            on:mousedown|preventDefault={() => listItemClick(option.value)}
                            data-value={option.value}>
                            {#if $$slots.option}
                                <slot
                                    name="option"
                                    item={option}
                                    markup={mark(
                                        option.name,
                                        lastQuery,
                                        `<span class="search-mark ${
                                            selectedRecords[option.value] ? "active" : ""
                                        }">`,
                                        "</span>"
                                    )} />
                            {:else}
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html sanitize(
                                    mark(
                                        option.name,
                                        lastQuery,
                                        `<span class="search-mark ${
                                            selectedRecords[option.value] ? "active" : ""
                                        }">`,
                                        "</span>"
                                    )
                                )}
                            {/if}
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../scss/variables";

    $multiselect-dark-theme-input-color: $white;
    $multiselect-option-item-background-color: var(--bs-body-bg);
    $multiselect-option-selected-item-background-color: $primary;
    $multiselect-option-selected-item-color: $body-bg;
    $multiselect-option-active-item-border-color: $primary;
    $multiselect-option-active-selected-item-border-color: $body-bg;

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
            gap: 1px;
            position: relative;
            & > .btn {
                padding: var(--bs-badge-padding-y) var(--bs-badge-padding-x);
                text-transform: initial;
            }
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
                    padding: 0.5rem;
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

    :global(html[data-bs-theme="dark"] .multiselect input) {
        color: $multiselect-dark-theme-input-color;
    }
</style>
