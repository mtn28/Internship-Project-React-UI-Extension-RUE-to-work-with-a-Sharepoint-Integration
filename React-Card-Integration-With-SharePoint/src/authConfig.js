import { LogLevel } from "@azure/msal-browser";

const clientId = process.env.REACT_APP_CLIENT_ID;
const tenantId = process.env.REACT_APP_TENANT_ID;

export const msalConfig = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: /*"http://localhost:3000"*/ "https://microsoft-sharepoint-authentication.vercel.app/",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	    
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

export const loginRequest = {
    scopes: ["User.Read", "Sites.Read.All", "Sites.ReadWrite.All", "Files.Read.All", "Files.ReadWrite.All"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};