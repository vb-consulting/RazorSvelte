/// <reference types="svelte" />
import App from "../App/authorized-page.svelte";
import init from "../App/shared/init";
export default new App({target: document.body, props: init("AuthorizedPage") ?? {}});

