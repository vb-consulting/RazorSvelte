import { writable } from "svelte/store";
export const error = writable<string>("");
export const info = writable<string>("");
export const warning = writable<string>("");
