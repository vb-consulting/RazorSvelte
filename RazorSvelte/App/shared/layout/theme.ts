import { writable } from "svelte/store";
import { get } from "../config";

const key = get<string>("theme-key");
const link = document.head.querySelector(`#${key}`) as HTMLLinkElement;
const defaultTheme: string = link?.dataset?.theme as string;

export const isDarkTheme = writable<boolean>(defaultTheme == "dark");

if (link) {
    isDarkTheme.subscribe(isDark => {
        let d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        if (!isDark) {
            link.dataset.theme = "light";
            link.href = link.href.replace("dark", "light");
            document.cookie = `${key}=light; expires=${d.toUTCString()}`;
        } else {
            link.dataset.theme = "dark";
            link.href = link.href.replace("light", "dark");
            document.cookie = `${key}=dark; expires=${d.toUTCString()}`;
        }
    });
}
