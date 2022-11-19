import { writable } from "svelte/store";
import { themeKey } from "../config";

const dark = "dark";
const light = "light";

const link = document.head.querySelector(`#${themeKey}`) as HTMLLinkElement;
const defaultTheme: string = link?.dataset?.theme as string;

export const isDarkTheme = writable<boolean>(defaultTheme == dark);

if (link) {
    isDarkTheme.subscribe(isDark => {
        let d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        if (!isDark) {
            link.dataset.theme = light;
            link.href = link.href.replace(dark, light);
            document.cookie = `${themeKey}=${light}; expires=${d.toUTCString()}`;
            document.body.classList.add(light);
            document.body.classList.remove(dark);
        } else {
            link.dataset.theme = dark;
            link.href = link.href.replace(light, dark);
            document.cookie = `${themeKey}=${dark}; expires=${d.toUTCString()}`;
            document.body.classList.add(dark);
            document.body.classList.remove(light);
        }
    });
}
