import { logout } from "../../../libs/aws/cognito/helper/logout";
export async function signOut() {
  //TODO:Remove local Storage
  //logout from cognito
  logout();
}
