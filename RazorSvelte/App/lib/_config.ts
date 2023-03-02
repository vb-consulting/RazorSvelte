export let user: IUser = {isSigned: false, name: ""};
export let errorKey: string = "__error";
export let themeKey: string = "__theme";
export let title: string = document.title || document.location.pathname.replace(/\//g, "");
export let cacheVersion: string = "";
export let urlPrefix: string = "";
export let indexUrl: string = "/";
export let logoutUrl: string = "/logout";
export let loginUrl: string = "/login";
export let errorUrl: string = "/error";
export let notFoundUrl: string = "/404";

export function setUser(value: IUser){ user = value };
export function setErrorKey(value: string){ errorKey = value };
export function setThemeKey(value: string){ themeKey = value };
export function setTitle(value: string){ title = value };
export function setCacheVersion(value: string){ cacheVersion = value };
export function setUrlPrefix(value: string){ urlPrefix = value };
export function setIndexUrl(value: string){ indexUrl = value };
export function setLogoutUrl(value: string){ logoutUrl = value };
export function setLoginUrl(value: string){ loginUrl = value };
export function setErrorUrl(value: string){ errorUrl = value };
export function setNotFoundUrl(value: string){ notFoundUrl = value };

