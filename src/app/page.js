import NavbarComponent from "./components/composite/Navbar";
import { unauthenticatedMenuItems } from "../constants/Navbar/constants.js";
import { Button } from "@heroui/react";
import Link from "next/link";



export default function Home() {

  return (
    <>
    <NavbarComponent menuItems={unauthenticatedMenuItems}>
      This is homepage
    </NavbarComponent>
    <div className="flex items-center justify-center">
      <Link href="/review" passHref>
        <Button color="primary">
          Go to Reviews
        </Button>
      </Link>
      </div>
    </>
  );
}
