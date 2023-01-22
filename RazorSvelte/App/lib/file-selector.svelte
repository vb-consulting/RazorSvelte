<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from "svelte";

    export const instance: IFileSelector = {
        getValue: () => fileinput.value,
        open() {
            fileinput.click();
        }
    };
    export { classes as class };
    export { styles as style };

    let classes: string = "";
    let styles: string = "";

    let fileinput: HTMLInputElement;
    let dragging = false;

    const dispatch = createEventDispatcher();

    function onFileSelected(e: any) {
        if (!e?.target?.files.length) {
            return;
        }
        let file = e.target.files[0] as File;
        if (!file || !file.size) {
            return;
        
        }
        dispatch("select", {file, instance});
        fileinput.value = "";
    }

    function onDrop(e: any) {
        dragging = false;
        if (!e.dataTransfer.files) {
            return;
        }
        let file = e.dataTransfer.files[0] as File;
        if (!file || !file.size) {
            return;
        }
        dispatch("select", {file, instance});
        fileinput.value = "";
    }

    let dragTimeout: NodeJS.Timeout;
    function onDragleave() {
        if (dragTimeout) {
            clearTimeout(dragTimeout);
            dragTimeout = undefined;
        }
        dragTimeout = setTimeout(() => {
            dragging = false;
            clearTimeout(dragTimeout);
            dragTimeout = undefined;
        }, 500);
    }

    function preventDefault(e: DragEvent) {
        e.preventDefault()
    }

    onMount(() => {
        document.addEventListener("dragenter", preventDefault);
        document.addEventListener("dragover", preventDefault);
        document.addEventListener("dragleave", preventDefault);
        document.addEventListener("drop", preventDefault);
    });

    onDestroy(() => {
        document.removeEventListener("dragenter", preventDefault);
        document.removeEventListener("dragover", preventDefault);
        document.removeEventListener("dragleave", preventDefault);
        document.removeEventListener("drop", preventDefault);
    });
</script>

<input class="d-none" 
    title="upload"
    type="file" 
    on:change={onFileSelected} 
    bind:this={fileinput}>

<div class="{classes || ''}" style="{styles || ''}" class:dragging on:drop={onDrop} on:dragover={() => dragging = true} on:dragleave={onDragleave}>
    <slot></slot>
</div>

<style lang="scss">
    @import "../../styles/main";
    .dragging {
        filter: brightness(85%);
    }
</style>