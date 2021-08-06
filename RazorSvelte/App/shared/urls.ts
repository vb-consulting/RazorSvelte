import { getFromJson } from "./hidden-values";

const urls = getFromJson<{
    authorizedUrl: string;
    indexUrl: string;
    loginUrl: string;
    logoutUrl: string;
    privacyUrl: string;
    spaUrl: string;
    signInGoogleUrl: string;
    signInLinkedInUrl: string;
    signInGitHubUrl: string;
}>("urls");

export default urls;