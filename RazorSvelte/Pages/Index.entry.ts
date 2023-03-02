/// <reference types="svelte" />
import App from "../App/index.svelte";
import init from "../App/shared/init";
export default new App({target: document.body, props: init("Index") ?? {}});
