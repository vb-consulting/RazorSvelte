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

export const getFromJson = <T extends Record<string, any>>(id: string) => {
    return JSON.parse(get<string>(id) as string) as T;
}

export const getAll = <T extends Record<string, any>>() => {
    const result: Record<string, any> = {};
    const elements: Array<HTMLInputElement> = [];
    for (let e of document.getElementsByTagName("input")) {
        if (e.type != "hidden") {
            continue;
        }
        if (e.id.startsWith("is")) {
            result[e.id] = e.value.toLowerCase() == "true";
        } else {
            result[e.id] = e.value;
        }
        elements.push(e);
    }
    for (let e of elements) {
        e.remove();
    }
    return result as T;
}