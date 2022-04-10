/// <reference types="svelte" />
import App from "../App/spa-example.svelte";
document.getElementById("loading")?.remove();
export default  new App({target: document.body});
