<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from "svelte";
    /**
     * Selected file
     */
    export let file: File | undefined = undefined;
    /**
     * Name of dragging class that will be applied to the element when a file is dragged over it.
     */
    export let draggingClass = "dragging";
    /**
     * A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method Document.getElementsByClassName().
     */
    export { classes as class };
    /*
     * Contains CSS styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the style element have mainly the purpose of allowing for quick styling, for example for testing purposes.
     */
    export { styles as style };
    /**
     * Instance of the file selector that can be used to open the file selector manually.
     */
    export const instance: IFileSelector = {
        file: file,
        getInput: () => fileinput,
        open() {
            fileinput.click();
        }
    };

    let classes: string = "";
    let styles: string = "";

    let fileinput: HTMLInputElement;
    let dragging = false;

    const dispatch = createEventDispatcher();

    function onFileSelected(e: any) {
        if (!e?.target?.files.length) {
            return;
        }
        let selectedFile = e.target.files[0] as File;
        if (!selectedFile || !selectedFile.size) {
            return;
        }
        file = selectedFile;
        dispatch("select", { file, instance });
        fileinput.value = "";
    }

    function onDrop(e: any) {
        dragging = false;
        if (!e.dataTransfer.files) {
            return;
        }
        let selectedFile = e.dataTransfer.files[0] as File;
        if (!selectedFile || !selectedFile.size) {
            return;
        }
        file = selectedFile;
        dispatch("select", { file, instance });
        fileinput.value = "";
    }

    let dragTimeout: number | undefined;
    function onDragleave() {
        if (dragTimeout) {
            clearTimeout(dragTimeout);
        }
        dragTimeout = setTimeout(() => {
            dragging = false;
            dragTimeout = undefined;
        }, 500);
    }

    function preventDefault(e: DragEvent) {
        e.preventDefault();
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

<svelte:head>
    <input
        class="d-none"
        title="upload"
        type="file"
        on:change={onFileSelected}
        bind:this={fileinput} />
</svelte:head>

<div
    class="{dragging ? draggingClass : ''} {classes || ''}"
    style={styles || ""}
    role="button"
    tabindex="0"
    on:drop={onDrop}
    on:dragover={() => (dragging = true)}
    on:dragleave={onDragleave}>
    <slot />
</div>

<style lang="scss">
    .dragging {
        background-image: linear-gradient(rgb(0 0 0/5%) 0 0);
    }
</style>
