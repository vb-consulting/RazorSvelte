/// <reference types="svelte" />
import App from "./Index.cshtml.svelte";
import "bootstrap/js/src/collapse";

export default new App({
    target: document.body,
    props: {
        name: "world from svelte"
    }
});
