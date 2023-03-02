/// <reference types="svelte" />
import App from "../App/chartdemo.svelte";
import init from "../App/shared/init";
export default new App({target: document.body, props: init("ChartDemo") ?? {}});

