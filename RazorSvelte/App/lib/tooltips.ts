import Tooltip from "bootstrap/js/dist/tooltip";

function run(callback: (instance: Tooltip | null, e: Element) => void) {
    for(let e of document.querySelectorAll("[data-bs-toggle='tooltip']")) {
        callback(Tooltip.getInstance(e), e);
    }
}

export const hideTooltips = () => {
    run((instance, e) => {
        if (instance) {
            instance.hide();
        }
    });
}

export const createTooltips = () => {
    run((instance, e) => {
        if (!instance || (instance && e.hasAttribute("title"))) {
            new Tooltip(e);
        }
    });
}
