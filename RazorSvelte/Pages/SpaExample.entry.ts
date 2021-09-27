/// <reference types="svelte" />
import App from "../App/SpaExample.svelte";
import "bootstrap/js/src/collapse";
document.getElementById("loading")?.remove();
export default  new App({target: document.body});
