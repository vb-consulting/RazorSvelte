/// <reference types="svelte" />
import App from "../App/SpaExample.svelte";
document.getElementById("loading")?.remove();
export default  new App({target: document.body});
