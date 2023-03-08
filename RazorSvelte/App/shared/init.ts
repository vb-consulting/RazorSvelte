import {
    setUser,
    setErrorKey,
    setThemeKey,
    setTitle,
    setCacheVersion,
    setUrlPrefix,
    setIndexUrl,
    setLogoutUrl,
    setLoginUrl,
    setErrorUrl,
    setNotFoundUrl
} from "../lib/_config";
import urls from "./urls";

const getValue = <T>(id: string) => {
    const e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return "";
    }
    const value = e.value;
    e.remove();
    return value as unknown as T;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const getValueFromJson = <T extends Record<string, any>>(id: string) =>
    JSON.parse(getValue<string>(id) as string) as T;

export default function init(pageName: string): void | Record<string, never> {
    console.log(`init ${pageName}`);
    setUser(getValueFromJson<IUser>("user"));
    setErrorKey(getValue<string>("error-key") ?? "");
    setThemeKey(getValue<string>("theme-key") ?? "");
    setTitle(getValue<string>("title"));
    setCacheVersion(getValue<string>("cache-version") ?? "");
    setUrlPrefix(getValue<string>("url-prefix") ?? "");
    setIndexUrl(urls.indexUrl);
    setLogoutUrl(urls.logoutUrl);
    setLoginUrl(urls.loginUrl);
    setErrorUrl(urls.errorUrl);
    setNotFoundUrl(urls.notFoundUrl);
}
