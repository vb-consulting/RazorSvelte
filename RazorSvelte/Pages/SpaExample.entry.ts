/// <reference types="svelte" />
import App from "../App/spaExample.svelte";
document.getElementById("loading")?.remove();
export default  new App({target: document.body});
