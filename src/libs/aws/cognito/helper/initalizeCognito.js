//Initialize the Cognito


import { getAWSCognitoENV } from "../config";
export function InitializeAWSCognito() {
  try {
    const { authority, appClientId, redirectSignIn } = getAWSCognitoENV();
    const cognitoAuthConfig = {
      authority: authority,
      client_id: appClientId,
      redirect_uri: redirectSignIn,
      response_type: "code",
      scope: "phone openid email",
    };
    return cognitoAuthConfig;
  } catch (error) {}
}
