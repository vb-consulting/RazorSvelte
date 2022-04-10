
export const get = <T>(id: string) => {
    let e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return null;
    }
    let value = e.value;
    e.remove();
    return value as unknown as T;
}

export const getBool = (id: string) => {
    let e = document.querySelector(`input#${id}[type=hidden]`) as HTMLInputElement;
    if (!e) {
        return false;
    }
    let value = e.value;
    e.remove();
    return value.toLowerCase() == "true";
}

export const getFromJson = <T extends Record<string, any>>(id: string) => JSON.parse(get<string>(id) as string) as T;
