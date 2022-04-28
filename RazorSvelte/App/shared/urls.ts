import { getFromJson } from "./config";

const urls = getFromJson<{
    authorizedUrl: string;
    indexUrl: string;
    privacyUrl: string;
    offcanvasNavUrl: string;
    loginUrl: string;
    logoutUrl: string;
    aboutUrl: string;
    spaUrl: string;
    signInGoogleUrl: string;
    signInLinkedInUrl: string;
    signInGitHubUrl: string;
}>("urls");

export default urls;