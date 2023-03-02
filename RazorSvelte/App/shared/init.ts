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
    let e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return "";
    }
    let value = e.value;
    e.remove();
    return value as unknown as T;
}

const getValueFromJson = <T extends Record<string, any>>(id: string) => JSON.parse(getValue<string>(id) as string) as T;

export default function init(pageName: string) : void | Record<string, never> {
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