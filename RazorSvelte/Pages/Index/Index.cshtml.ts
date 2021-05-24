import App from "./Index.cshtml.svelte";
import bootstrap from "bootstrap/js/src/collapse"

const index = new App({
    target: document.getElementsByClassName("index")[0],
    props: {
        name: "world"
    }
});

export default index;