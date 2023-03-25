export let title: string = "";

export let errorKey: string = "__error";
export let themeKey: string = "__theme";

export let cacheVersion: string = "";
export let urlPrefix: string = "";

export let errorUrl: string = "/error";
export let notFoundUrl: string = "/404";

export let user: IUser = {
    isSigned: false,
    id: "",
    name: "",
    email: ""
};

export type link = { text: string; url: string };

export let signedUserLinks: link[] = [];
export let unsignedUserLinks: link[] = [];

export function setTitle(value: string) {
    title = value;
}

export function setKeys(errorKeyValue: string, themeKeyValue: string) {
    errorKeyValue && (errorKey = errorKeyValue);
    themeKeyValue && (themeKey = themeKeyValue);
}

export function setFetchConfig(cacheVersionValue: string, urlPrefixValue: string) {
    cacheVersionValue && (cacheVersion = cacheVersionValue);
    urlPrefixValue && (urlPrefix = urlPrefixValue);
}

export function setUser(value: IUser) {
    user = value;
}

export function setHeaderLinks(signedUserLinksValue: link[], unsignedUserLinksValue: link[]) {
    signedUserLinks = signedUserLinksValue;
    unsignedUserLinks = unsignedUserLinksValue;
}

export function setCommonUrls(errorUrlValue: string, notFoundUrlValue: string) {
    errorUrlValue && (errorUrl = errorUrlValue);
    notFoundUrlValue && (notFoundUrl = notFoundUrlValue);
}
