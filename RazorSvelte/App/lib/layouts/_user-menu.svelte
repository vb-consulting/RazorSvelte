<script lang="ts">
    import Icon from "$visual/icon.svelte";
    import Popover from "$element/popover.svelte";
    import { isDarkTheme } from "$lib/theme";
    import { hideTooltips } from "$element/tooltips";
    import { user, signedUserLinks, unsignedUserLinks } from "$lib/config";

    function toggleTheme() {
        $isDarkTheme = !$isDarkTheme;
        hideTooltips();
    }
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<a tabindex="0" class="btn btn-sm btn-primary mx-1 rounded-pill">
    <Icon material="account_circle" />
</a>
<Popover trigger="focus">
    <div slot="title">
        {#if user.isSigned}
            <Icon bootstrap="person" />
            {user.name}
        {:else}
            <Icon bootstrap="person-exclamation" />
            unsigned user
        {/if}
    </div>
    <div class="text-center">
        <div>
            {#if user.isSigned}
                {#each signedUserLinks as link}
                    <a class="btn btn-sm btn-link" href={link.url}>
                        {link.text}
                    </a>
                {/each}
            {:else}
                {#each unsignedUserLinks as link}
                    <a class="btn btn-sm btn-link" href={link.url}>
                        {link.text}
                    </a>
                {/each}
            {/if}
        </div>
        <button
            class="btn rounded-pill text-primary mt-2"
            on:click={toggleTheme}
            data-bs-toggle="tooltip"
            title={$isDarkTheme ? "Lights On" : "Lights Off"}>
            <Icon material={$isDarkTheme ? "light_mode" : "dark_mode"} materialType="outlined" />
        </button>
    </div>
</Popover>
