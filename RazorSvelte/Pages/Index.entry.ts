/// <reference types="svelte" />
import App from "../App/Index.svelte";
import "bootstrap/js/src/collapse";

export default new App({
    target: document.body,
    props: {
        name: "world from svelte"
    }
});
