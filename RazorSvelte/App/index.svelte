<script lang="ts">
    import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

    function initEditor(e: HTMLElement) {
        let editor = monaco.editor.create(e, {
            language: "pgsql",
            theme: "vs-dark",
            renderWhitespace: "all",
            automaticLayout: false,
            selectOnLineNumbers: true,
            glyphMargin: true,
            smoothScrolling: true,
            //contextmenu: false //todo: disable default contextmenu and implement a better one
        });
    }
</script>

<div use:initEditor>

</div>


<style lang="scss">
    @import "../Styles/colors.scss";

    div {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: $dark;
    }
</style>