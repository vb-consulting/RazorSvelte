/// <reference types="svelte" />
import App from "../App/index.svelte";
import "bootstrap/js/src/collapse";

export default new App({
    target: document.body,
    props: {
        name: "world from svelte"
    }
});
