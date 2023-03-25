import { errorKey, cacheVersion, urlPrefix, notFoundUrl, errorUrl } from "$lib/config";

export const getUrl = (url: string) => urlPrefix + url;

const _fetch = async <T>(req: {
    url: string;
    method: string;
    func: "json" | "text";
    content?: any;
    raw: boolean;
    redirectOnError: boolean;
}) => {
    let init: RequestInit;
    if (req.content) {
        init = {
            headers:
                req.func == "json"
                    ? { Accept: "application/json", "Content-Type": "application/json" }
                    : {
                          Accept: "text/plain; charset=utf-8",
                          "Content-Type": "text/plain; charset=utf-8"
                      },
            method: req.method,
            body: JSON.stringify(req.content)
        };
    } else {
        init = { method: req.method };
    }

    const response = await fetch(getUrl(req.url), init);
    if (req.raw) {
        return response;
    }
    if (!response.ok && response.status != 401) {
        const error = await response.text();
        const short = error.split("\n")[0];
        sessionStorage.setItem(errorKey, short);
        if (req.redirectOnError) {
            if (response.status == 404) {
                document.location.assign(notFoundUrl);
            } else {
                document.location.assign(errorUrl);
            }
        } else {
            throw short;
        }
        return;
    }
    if (response.status == 401) {
        //
        // if we get unauthorized status, reload the entire page so that backend redirects to a user friendly /401 page
        //
        document.location.reload();
        return req.raw == false ? ((await response[req.func]()) as T) : response;
    }
    if (req.raw) {
        return response;
    }
    return (await response[req.func]()) as T;
};

type TContent = Record<any, any> | null | any;

export const parseQuery = (query: Record<any, any>) =>
    Object.keys(query)
        .map((key) => {
            const value = query[key];
            if (Array.isArray(value)) {
                return value.map((s) => `${key}=${encodeURIComponent(s)}`).join("&");
            }
            return `${key}=${encodeURIComponent(query[key])}`;
        })
        .filter((p) => p)
        .join("&");

export const parseUrl = (url: string, query: TContent = null) =>
    query ? `${url}?${parseQuery(query)}` : url;

export const get = async <T>(url: string, query: TContent = null, redirectOnError = false) =>
    _fetch<T>({
        url: parseUrl(url, query),
        method: "GET",
        func: "json",
        raw: false,
        redirectOnError
    }) as Promise<T>;

export const getCached = async <T>(
    url: string,
    query: TContent = null,
    redirectOnError = false
) => {
    if (cacheVersion) {
        if (!query) {
            query = { _v: cacheVersion };
        } else {
            query["_v"] = cacheVersion;
        }
    }
    return get<T>(url, query, redirectOnError);
};

export const post = async <T>(
    url: string,
    query: TContent = null,
    content: TContent = null,
    redirectOnError = false
) =>
    _fetch<T>({
        url: parseUrl(url, query),
        method: "POST",
        func: "json",
        content,
        raw: false,
        redirectOnError
    }) as Promise<T>;

export const postText = async (
    url: string,
    query: TContent = null,
    content: string = "",
    redirectOnError = true
) =>
    _fetch<Response>({
        url: parseUrl(url, query),
        method: "POST",
        func: "text",
        content,
        raw: true,
        redirectOnError
    });

export const upload = (
    url: string,
    query: Record<any, any> | null = null,
    file: File,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    progress = (loaded: number, total: number) => {}
) =>
    new Promise<XMLHttpRequest>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener(
            "progress",
            (event) => {
                if (event.lengthComputable) {
                    progress(event.loaded, event.total);
                }
            },
            false
        );

        xhr.onload = function () {
            resolve(this);
        };

        xhr.onerror = function () {
            reject(this);
        };

        xhr.open("POST", getUrl(parseUrl(url, query)));

        const formData = new FormData();
        formData.append("file", file);

        xhr.setRequestHeader("Accept", "text/plain; charset=utf-8");

        xhr.send(formData);
    });
