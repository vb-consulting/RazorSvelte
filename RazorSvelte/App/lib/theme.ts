import { writable } from "svelte/store";
import { themeKey } from "$lib/config";

const dark = "dark";
const light = "light";

const html = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
const defaultTheme: string = html?.dataset.bsTheme as string;

export const isDarkTheme = writable<boolean>(defaultTheme == dark);
export const themes: ThemesType[] = [light, dark];
export const theme = writable<ThemesType>(defaultTheme == dark ? dark : light);

theme.subscribe((theme) => isDarkTheme.set(theme == dark));

if (html) {
    isDarkTheme.subscribe((isDark) => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        if (!isDark) {
            html.dataset.bsTheme = light;
            document.cookie = `${themeKey}=${light}; expires=${d.toUTCString()}; path=/`;
        } else {
            html.dataset.bsTheme = dark;
            document.cookie = `${themeKey}=${dark}; expires=${d.toUTCString()}; path=/`;
        }
    });
}
