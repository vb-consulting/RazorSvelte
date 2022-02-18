<script lang="ts">
    import Button from "@smui/button";
    import IconButton from '@smui/icon-button';
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import TopAppBar, {Row, Section, AutoAdjust} from "@smui/top-app-bar";
    import type {TopAppBarComponentDev} from "@smui/top-app-bar";
    import { Label } from '@smui/common';
    import { getAll } from "./Config";
    import urls from "./Urls";

    let user = getAll<{isSigned: Boolean, email: string}>();
    let topAppBar: TopAppBarComponentDev;    
    let themeLink = document.head.querySelector<HTMLLinkElement>("#theme");
    let isLight = themeLink?.href ? themeLink?.href.indexOf("style-dark") > -1 : false;

    function switchTheme() {
        isLight = !isLight;
        if (themeLink) {
            if (isLight) {
                themeLink.href = themeLink?.href.replace("style-light", "style-dark").replace(document.location.origin, "");
                localStorage.setItem("theme", "style-dark");
                console.log("switched to dark");
            } else {
                themeLink.href = themeLink?.href.replace("style-dark", "style-light").replace(document.location.origin, "");
                localStorage.setItem("theme", "style-light");
                console.log("switched to light");
            }
        }
    }
</script>

<TopAppBar bind:this={topAppBar} variant="standard" color="primary" dense>
    <Row>
        <Section>
            <Button href="{urls.indexUrl}">
                <Label>Home</Label>
            </Button>
            <Button href="{urls.aboutUrl}">
                <Label>About</Label>
            </Button>
            <Button href="{urls.authorizedUrl}">
                <Label>Authorized Access</Label>
            </Button>
            <Button href="{urls.spaUrl}">
                <Label>Spa Example</Label>
            </Button>
        </Section>
        <Section align="end" toolbar>
            {#if user.isSigned}
                <Label>{user.email}</Label>
                <Button href="{urls.logoutUrl}">
                    <Label>Logout</Label>
                </Button>
            {:else}
                <Button href="{urls.loginUrl}">
                    <Label>Login</Label>
                </Button>
            {/if}
            <Wrapper>
                <IconButton on:click={switchTheme} class="material-icons">
                    {isLight ? "wb_sunny" : "brightness_3"}
                </IconButton>
                <Tooltip>{isLight ? "Switch to light theme" : "Switch to dark theme"}</Tooltip>
            </Wrapper>
        </Section>
    </Row>
</TopAppBar>

<AutoAdjust {topAppBar} class="main">
    <div class="content">
        <slot></slot>
    </div>
    <div class="footer">
        &copy; {new Date().getFullYear()} - <a href="{urls.aboutUrl}">VB-Consulting & VB-Software</a>
    </div>
</AutoAdjust>

