import { errorKey, urls, cacheVersion } from "./config";

const _fetch = async <T> (url: string, method: string, func: "json" | "text", content?: any, raw = false, redirectOnError = false) => {
    let init: RequestInit;
    if (content) {
        init = {
            headers: func == "json" ? 
                {"Accept": "application/json", "Content-Type": "application/json"} :
                {"Accept": "text/plain; charset=utf-8", "Content-Type": "text/plain; charset=utf-8"},
            method,
            body: JSON.stringify(content)
        }
    } else {
        init = {method};
    }

    const response = await fetch(url, init);
    if (!response.ok && response.status != 401) {
        const error = await response.text();
        const short = error.split("\n")[0];
        sessionStorage.setItem(errorKey, short);
        if (redirectOnError) {
            document.location.assign(urls.errorUrl);
        } else {
            console.error(short);
            throw short;
        }
        return;
    }
    if (response.status == 401) {
        //
        // if we get unauthorized status, reload the entire page so that backend redirects to a user friendly /401 page
        //
        document.location.reload();
        return raw  == false ? (await response[func]() as T) : response;
    }
    if (raw) {
        return response;
    }
    return await response[func]() as T;
}

type TContent = Record<any, any> | null | any;

export const parseQuery = (query: Record<any, any>) => 
    Object
    .keys(query)
    .map(key => {
        const value = query[key];
        if (Array.isArray(value)) {
            return value.map(s => `${key}=${encodeURIComponent(s)}`).join('&');
        }
        return `${key}=${encodeURIComponent(query[key])}`;
    })
    .filter(p => p)
    .join('&');

export const  parseUrl = (url: string, query: TContent = null) => 
    query ? `${url}?${parseQuery(query)}` : url;

export const get = async <T> (url: string, query: TContent = null, redirectOnError = false) => 
    _fetch<T>(parseUrl(url, query), "GET", "json", null, redirectOnError) as Promise<T>;

export const getCached = async <T> (url: string, query: TContent = null, redirectOnError = false) => {
    if (cacheVersion) {
        if (!query) {
            query = {"_v": cacheVersion}
        } else {
            query["_v"] = cacheVersion;
        }
    }
    return _fetch<T>(parseUrl(url, query), "GET", "json", null, redirectOnError) as Promise<T>;
}
export const post = async <T> (url: string, query: TContent = null, content: TContent = null, redirectOnError = false) => 
    _fetch<T>(parseUrl(url, query), "POST", "json", content, redirectOnError) as Promise<T>;
