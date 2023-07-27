<script lang="ts">
    import { user, loginUrl, logoutUrl } from "$lib/config";
    import { afterUpdate, beforeUpdate } from "svelte";
    import { createTooltips, hideTooltips } from "$element/tooltips";
    import { title as configTitle } from "$lib/config";
    import Icon from "$visual/icon.svelte";

    import DiminishingNav from "$layout/_diminishing-nav.svelte";
    import ThemeBtn from "$layout/_theme-button.svelte";

    import Dialog, { openDialog } from "$overlay/dialog.svelte";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface $$Slots {
        default: {};
        links: {};
    }

    export let title: string | undefined = undefined;

    const githubUrl = "https://github.com/vb-consulting/RazorSvelte";

    const breakpointWidth = 480;
    const sidebarWidth = 200;
    const sidebarKey = "sidebar-pinned";

    let width: number;
    let diminishNavClass: string;
    let content: HTMLElement;

    let sidebar: boolean =
        localStorage.getItem(sidebarKey) == null
            ? true
            : localStorage.getItem(sidebarKey) == "true";

    let sidebarBreak: boolean = false;

    $: breakpoint = width < breakpointWidth;
    $: sidebarWidthValue = breakpoint
        ? sidebarBreak
            ? "100%"
            : "0"
        : sidebar
        ? `${sidebarWidth}px`
        : "0";
    $: mainStyle = `grid-template-columns: ${sidebarWidthValue} 1fr;`;
    $: linksWraptyle =
        breakpoint && sidebarBreak
            ? "width: 100%"
            : sidebarWidthValue != "0"
            ? `max-width: ${sidebarWidthValue}`
            : "display: none";

    $: contentStyle = breakpoint && sidebarBreak ? "display: none" : "";
    $: sideBarShowClass = breakpoint
        ? sidebarBreak
            ? "sidebar-show"
            : "sidebar-hide"
        : sidebar
        ? "sidebar-show"
        : "sidebar-hide";

    if (!title) {
        title = configTitle;
    }

    function toggleSidebar() {
        if (!breakpoint) {
            sidebar = !sidebar;
        } else {
            sidebarBreak = !sidebarBreak;
        }
        localStorage.setItem(sidebarKey, sidebar.toString());
    }

    function askLogout(e: any) {
        const href = e.currentTarget?.getAttribute("href") || e.target?.getAttribute("href");
        openDialog(
            "Do you want to logout?",
            ["Ok", "Cancel"],
            (action) => {
                if (action == "Ok") {
                    if (href) {
                        location = href;
                    }
                }
            },
            {
                centered: false
            }
        );
    }

    beforeUpdate(hideTooltips);
    afterUpdate(createTooltips);
</script>

<svelte:window bind:outerWidth={width} />
<DiminishingNav bind:diminishNavClass element={content} />
<Dialog />

<header>
    <nav
        class="navbar navbar-expand-md navbar-dark fixed-top bg-primary py-0 py-md-0 {diminishNavClass}">
        <div class="container-fluid flex-nowrap">
            <button
                type="button"
                class="d-flex btn btn-sm btn-primary logo animate-rotate {(!breakpoint &&
                    sidebar) ||
                (breakpoint && sidebarBreak)
                    ? 'rotate'
                    : 'rotate-back'}"
                on:click={toggleSidebar}>
                <Icon material="menu" materialType="outlined" />
                <span class="ps-1">{title}</span>
            </button>

            <div class="d-flex">
                <a
                    class="nav-link my-auto me-2"
                    href={githubUrl}
                    data-bs-toggle="tooltip"
                    title="GitHub Repo">
                    <Icon bootstrap="github" />
                </a>
                {#if user.isSigned}
                    <div class="nav-link my-auto fs-smaller ms-2 me-1 cursor-default">
                        {user.email}
                    </div>
                    <a
                        class="nav-link my-auto"
                        href={logoutUrl}
                        on:click|preventDefault={askLogout}
                        data-bs-toggle="tooltip"
                        title="Logout">
                        <Icon bootstrap="person-x" />
                    </a>
                {:else}
                    <div class="vr text-white my-auto" />
                    <a
                        class="nav-link my-auto"
                        href={loginUrl}
                        data-bs-toggle="tooltip"
                        title="Login">
                        <Icon bootstrap="person-circle" />
                    </a>
                {/if}
                <div class="vr text-white my-auto" />
                <ThemeBtn />
            </div>
        </div>
    </nav>
</header>

<main style={mainStyle}>
    <div class="sidebar {diminishNavClass} {sideBarShowClass}">
        <div style={linksWraptyle}>
            {#if breakpoint}
                <button
                    type="button"
                    class="btn btn-sm close-sidebar"
                    on:click={() => (sidebarBreak = false)}>
                    <Icon material="close" materialType="outlined" />
                </button>
            {/if}
            <slot name="links" />
        </div>
    </div>
    <div class="content {diminishNavClass}" style={contentStyle} bind:this={content}>
        <slot />
    </div>
</main>

<style lang="scss">
    @import "../scss/variables";
    @import "../scss/layout";

    :root {
        --nav-height: 41px;
    }

    main > .sidebar {
        transition: transform 0.25s ease-out;
    }

    main > .sidebar.sidebar-show {
        transform: translateX(0px);
    }
    main > .sidebar.sidebar-hide {
        transform: translateX(-100%);
    }

    .content {
        overflow: auto;
    }

    :global(html[data-bs-theme="dark"] main > .sidebar) {
        background-color: $dark;
        filter: brightness(85%);
    }

    :global(html[data-bs-theme="light"] main > .sidebar) {
        background-color: $body-bg;
        filter: brightness(85%);
    }

    main {
        display: grid;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;

        & > .sidebar > div {
            position: fixed;
            width: 100%;
            left: 0;
            overflow-x: hidden;
            overflow-y: auto;
            padding-right: 0.5rem;
            padding-top: 1rem;

            & > .close-sidebar {
                position: fixed;
                top: 50px;
                right: 10px;
                padding: 0.25rem;
                z-index: 1;
            }
        }

        & > .sidebar.show-nav {
            & > div {
                top: var(--nav-height);
                height: calc(100vh - var(--nav-height));
            }
        }
        & > .sidebar.hide-nav {
            & > div {
                top: 0;
                height: 100vh;
            }
        }

        & > .content.show-nav {
            margin-top: var(--nav-height);
        }
    }

    nav {
        box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%),
            0px 1px 10px 0px rgb(0 0 0 / 12%);
        height: var(--nav-height);
        & > div {
            gap: 1rem;
            color: #adb5bd;
            & > div {
                overflow-x: hidden;
                text-overflow: ellipsis;
                & > div {
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        & > div *:hover {
            color: #fff !important;
        }
    }

    :global(main > .sidebar > div > .navbar-nav) {
        padding-right: 2rem;

        :global(.nav-item) {
            padding-left: 1rem;
            color: var(--bs-link-color);
        }
        :global(.nav-item:hover) {
            text-decoration: underline;
            color: var(--bs-link-hover-color);
            border-left: 0.25rem rgba($primary, 0.5) solid;
            padding-left: 0.75rem;
        }
        :global(.nav-item.active) {
            border-left: 0.25rem $primary solid;
            padding-left: 0.75rem;
            font-weight: 700;
            color: var(--bs-emphasis-color);
        }
    }

    .vr {
        width: 1px;
        opacity: 0.2;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .animate-rotate {
        & > :global(i) {
            transition: transform 0.25s ease-in-out;
        }
    }
    .rotate {
        & > :global(i) {
            transform: rotate(0deg);
        }
    }
    .rotate-back {
        & > :global(i) {
            transform: rotate(180deg);
        }
    }
</style>
