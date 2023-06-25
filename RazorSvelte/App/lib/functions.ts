/**
 * Mark segment in a string with tags
 *
 * @param source string to mark a segment in
 * @param search a segment to mark
 * @param open opening tag
 * @param open closing tag
 */
export function mark(
    source: string,
    search: string,
    open = "<span class='search-mark'>",
    close = "</span>"
) {
    if (!source) {
        return source;
    }
    if (!search) {
        return source;
    }
    const index = source.toLowerCase().indexOf(search.toLowerCase());
    if (index !== -1) {
        const segment = source.substring(index, index + search.length);
        return `${source.substring(0, index)}${open}${segment}${close}${source.substring(
            index + search.length,
            source.length
        )}`;
    }
    return source;
}
/**
 * Generate random characters string
 * @param length default 5
 */
export function generateId(length: number = 5) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Sanitize html string for Cross Site Scripting (XSS) attacks.
 * If input contains script tag, empty string will be returned and warning will be raised.
 *
 * @param input input html string
 * @param search a segment to mark
 * @param open opening tag
 * @param open closing tag
 */
export function sanitize(input: string) {
    if (!input) {
        return input;
    }
    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (regex.test(input)) {
        console.warn("Input contains script tag. It will be removed.");
        return "";
    }
    return input;
}
