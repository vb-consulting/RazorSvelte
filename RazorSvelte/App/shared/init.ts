import {
    setUser,
    setKeys,
    setTitle,
    setFetchConfig,
    setHeaderLinks,
    setCommonUrls
} from "$lib/config";
import urls from "$shared/urls";
import { theme } from "$lib/theme";

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

    setTitle(getValue<string>("title"));
    setKeys(getValue<string>("error-key") ?? "", getValue<string>("theme-key") ?? "");
    setFetchConfig(getValue<string>("cache-version") ?? "", getValue<string>("url-prefix") ?? "");

    const user = getValueFromJson<IUser>("user");
    setUser(user);

    setHeaderLinks(
        [
            { text: "Settings", url: "/settings" },
            { text: "Logout", url: urls.logoutUrl }
        ],
        [
            { text: "Login", url: urls.loginUrl },
            { text: "Register", url: urls.loginUrl }
        ]
    );

    setCommonUrls(urls.errorUrl, urls.notFoundUrl);

    let themeValue: string = "";
    theme.subscribe((value) => (themeValue = value));
    return {
        user: user as never,
        theme: themeValue as never
    };
}
