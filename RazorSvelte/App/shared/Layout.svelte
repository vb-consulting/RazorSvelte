<script lang="ts">
import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderUtilities,
    HeaderActionLink,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,

    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,

    Content,
    Grid,
    Row,
    Column,
    Theme,
    TooltipDefinition
} from "carbon-components-svelte";

import UserAvatarFilledAlt20 from "carbon-icons-svelte/lib/UserAvatarFilledAlt20";
import Logout16 from "carbon-icons-svelte/lib/Logout16";


import urls from "./urls";
import { getAll } from "./config";

let user = getAll<{isSigned: Boolean, email: string}>();

let isSideNavOpen = false;
let isMenuOpen = false;

const links = [
    {href: urls.indexUrl, text: "Home"},
    {href: urls.aboutUrl, text: "About"},
    {href: urls.authorizedUrl, text: "Authorized Access"},
    {href: urls.spaUrl, text: "Spa Example"},
];

let theme: any = "g100";

function setTheme(value: string) {
    theme = value;
    isMenuOpen = false;
}
</script>

<Theme bind:theme persist persistKey="__razor-svelte-theme" />

<Header persistentHamburgerMenu={true} platformName="RazorSvelte" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
    <HeaderNav>
        {#each links as link}
            <HeaderNavItem href="{link.href}" text="{link.text}" />
        {/each}
    </HeaderNav>

    <HeaderUtilities>
        <TooltipDefinition tooltipText="{user.isSigned ? "Logout" : "Login"}">
        {#if user.isSigned}
            <HeaderActionLink href="{urls.logoutUrl}" icon={Logout16} />
        {:else}
            <HeaderActionLink href="{urls.loginUrl}" icon={UserAvatarFilledAlt20} />
        {/if}
        </TooltipDefinition>

        <HeaderAction bind:isOpen={isMenuOpen}>
            <HeaderPanelLinks>
                <HeaderPanelDivider>Select Theme</HeaderPanelDivider>
                <HeaderPanelLink class="{theme=="white"?"bx--menu-option--active":""}" on:click={()=>setTheme("white")}>White</HeaderPanelLink>
                <HeaderPanelLink class="{theme=="g10"?"bx--menu-option--active":""}" on:click={()=>setTheme("g10")}>Light Gray</HeaderPanelLink>
                <HeaderPanelLink class="{theme=="g80"?"bx--menu-option--active":""}" on:click={()=>setTheme("g80")}>Gray</HeaderPanelLink>
                <HeaderPanelLink class="{theme=="g90"?"bx--menu-option--active":""}" on:click={()=>setTheme("g90")}>Dark Gray</HeaderPanelLink>
                <HeaderPanelLink class="{theme=="g100"?"bx--menu-option--active":""}" on:click={()=>setTheme("g100")}>Dark</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
    </HeaderUtilities>

    <SideNav bind:isOpen={isSideNavOpen}>
        <SideNavItems>
            {#each links as link}
                <SideNavLink href="{link.href}" text="{link.text}" />
            {/each}
        </SideNavItems>
    </SideNav>
</Header>


<Content class="content">
    <Grid>
        <Row>
            <Column>
                <slot></slot>
            </Column>
        </Row>
    </Grid>
</Content>

<style lang="scss">
:global(.content) {
    background-color: transparent;
}
:global(.activeThemeLink) {
    background-color: gray;
}
</style>
