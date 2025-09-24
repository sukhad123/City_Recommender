"use client"
import Providers from "./provider";
import NavbarComponent from "./components/composite/Navbar";
import { unauthenticatedMenuItems } from "../constants/Navbar/constants.js";
export default function Home() {
  return (
    <Providers>
    <NavbarComponent menuItems={unauthenticatedMenuItems}>
      This is homepage
    </NavbarComponent>
        </Providers>

  );
}
