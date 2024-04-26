<script lang="ts">
    import Icon from "$lib/icon.svelte";
    import { error, info, warning } from "$lib/toast";
    $: {
        if ($error) {
            setTimeout(() => ($error = ""), 10000);
        }
        if ($info) {
            setTimeout(() => ($info = ""), 10000);
        }
        if ($warning) {
            setTimeout(() => ($warning = ""), 10000);
        }
    }

    function textClass() {
        if ($error) {
            return "text-danger";
        } else if ($info) {
            return "text-info";
        } else if ($warning) {
            return "text-warning";
        }
    }

    function closeMessage() {
        $error = "";
        $info = "";
        $warning = "";
    }
</script>

{#if $error || $info || $warning}
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div class="toast show w-auto" role="alert">
            <div class="toast-header gap-2 {textClass()}">
                {#if $error}<Icon type="exclamation-circle-fill" />
                {:else if $info}<Icon type="check-circle-fill" />
                {:else if $warning}<Icon type="info-circle-fill" />
                {/if}
                {#if $error}<span class="">{$error}</span>
                {:else if $info}<span class="">{$info}</span>
                {:else if $warning}<span class="">{$warning}</span>
                {/if}
                <button type="button" class="btn-close" on:click={closeMessage}></button>
            </div>
        </div>
    </div>
{/if}
