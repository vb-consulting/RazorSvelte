import { getFromJson } from "./config";

const urls = getFromJson<{
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

export default urls;