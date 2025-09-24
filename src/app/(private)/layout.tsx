"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import NavbarComponent from "../components/composite/Navbar"
import { authenticatedMenuItems } from "../../constants/Navbar/constants";
import {createUser,findUser} from "../../repositories/user"

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
     //find the user in db
     //if doesnt exits a table for him
     const email = auth.user.profile.email;
     const user = findUser(email);
     if(!user)
     {
      console.log("Creating a new user)")

     }
      router.push("/test"); // redirect to home/login if not authenticated
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (!auth.isAuthenticated) {
    // temporary fallback while redirect happens
    return null;
  }

  return (
    <>
      <NavbarComponent
        isAuthenticated={true}
        menuItems={authenticatedMenuItems}
      >
        {children}
      </NavbarComponent>
    </>
  );
}
