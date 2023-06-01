import { writable } from "svelte/store";
import { themeKey } from "$lib/config";

export const dark = "dark";
export const light = "light";
export const themes: ThemesType[] = [light, dark];
export const theme = writable<ThemesType>(localStorage.getItem(themeKey) == dark ? dark : light);

theme.subscribe((value) => {
    document.getElementsByTagName("html")[0].dataset.bsTheme = value;
    localStorage.setItem(themeKey, value);
});
