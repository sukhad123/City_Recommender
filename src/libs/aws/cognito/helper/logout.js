import { getAWSCognitoENV } from "../config";
{
  /**Log out from cognito */
}
export function logout() {
  const { cognitoDomain, logOutUrl, appClientId } = getAWSCognitoENV();
  window.location.href = `${cognitoDomain}/logout?client_id=${appClientId}&logout_uri=${encodeURIComponent(
    logOutUrl
  )}`;
}
