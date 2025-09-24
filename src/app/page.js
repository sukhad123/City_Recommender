import NavbarComponent from "./components/composite/Navbar";
import { unauthenticatedMenuItems } from "../constants/Navbar/constants.js";
export default function Home() {
  return (
    <NavbarComponent menuItems={unauthenticatedMenuItems}>
      This is homepage
    </NavbarComponent>

  );
}
