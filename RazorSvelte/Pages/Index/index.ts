import App from "./Index.svelte";
import bootstrap from "../../node_modules/bootstrap/js/src/collapse.js"

const index = new App({
    target: document.getElementsByClassName("index")[0],
    props: {
        name: "world"
    }
});

export default index;