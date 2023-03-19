/// <reference types="svelte" />
import App from "../App/spa-example.svelte";
import init from "../App/shared/init";
document.getElementById("loading")?.remove();
export default  new App({target: document.body, props: init("Modal") ?? {}});
