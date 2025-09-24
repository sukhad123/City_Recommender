import NavbarComponent from "../components/composite/Navbar";
import { authenticatedMenuItems } from "../../constants/Navbar/constants";
export default function RootLayout({ children }) {
  return (
    <> 
    <NavbarComponent isAuthenticated={true} menuItems={authenticatedMenuItems}>
        This is Homepage/after login
        </NavbarComponent>
    
      </>
  );
}
