export const getValue = <T>(id: string) => {
    let e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return "";
    }
    let value = e.value;
    e.remove();
    return value as unknown as T;
}
export const getBoolValue = (id: string) => {
    let e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return false;
    }
    let value = e.value;
    e.remove();
    return value.toLowerCase() == "true";
}
export const getValueFromJson = <T extends Record<string, any>>(id: string) => JSON.parse(getValue<string>(id) as string) as T;
export let user = getValueFromJson<{isSigned: boolean, name?: string, email?: string, timezone?: string, timestamp?: string}>("user");

export const errorKey = getValue<string>("error-key");
export const themeKey = getValue<string>("theme-key");
export const title = getValue<string>("title");
export const urls = getValueFromJson<{
    authorizedUrl: string;
    indexUrl: string;
    errorUrl: string;
    privacyUrl: string;
    loginUrl: string;
    logoutUrl: string;
    aboutUrl: string;
    spaUrl: string;
    signInGoogleUrl: string;
    signInLinkedInUrl: string;
    signInGitHubUrl: string;
    
    chart1Url: string;
    chart2Url: string;
    chart3Url: string;
}>("urls");