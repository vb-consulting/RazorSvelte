import { getFromJson } from "./Config";

const urls = getFromJson<{
    authorizedUrl: string;
    indexUrl: string;
    loginUrl: string;
    logoutUrl: string;
    aboutUrl: string;
    spaUrl: string;
    signInGoogleUrl: string;
    signInLinkedInUrl: string;
    signInGitHubUrl: string;
}>("urls");

export default urls;