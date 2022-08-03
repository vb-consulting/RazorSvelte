const _fetch = async <T> (url: string, method: string, func: "json" | "text", content?: any, raw = false) => {
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
    if (response.ok) {
        return await response[func]() as T
    }
    throw response;
}

const _parseQuery = (query: Record<any, any>) => 
    Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&');

const _parseUrl = (url: string, query: Record<any, any> | null = null) => 
    query ? `${url}?${_parseQuery(query)}` : url;

export const get = async <T> (url: string, query: Record<any, any> | null = null) => 
    _fetch<T>(_parseUrl(url, query), "GET", "json") as Promise<T>;

export const post = async <T> (url: string, query: Record<any, any> | null = null, content: Record<any, any> | null = null) => 
    _fetch<T>(_parseUrl(url, query), "POST", "json", content) as Promise<T>;
