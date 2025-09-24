"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import NavbarComponent from "../components/composite/Navbar";
import { authenticatedMenuItems } from "../../constants/Navbar/constants";

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/"); // redirect to home/login if not authenticated
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (auth.isLoading) {
    return <p> </p>;
  }

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
