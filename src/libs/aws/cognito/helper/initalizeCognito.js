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
      scope: "email openid profile aws.cognito.signin.user.admin",
    };
    return cognitoAuthConfig;
  } catch (error) {}
}
