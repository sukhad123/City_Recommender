//Export all env here
export function getAWSCognitoENV() {
  const authority = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const appClientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID;
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const redirectSignIn = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN;
  if (!appClientId || !cognitoDomain || !redirectSignIn) {
    console.log("Missing Env Keys for AWS cognito");
  }
  //return all env keys for aws
  return { authority, appClientId, cognitoDomain, redirectSignIn };
}
