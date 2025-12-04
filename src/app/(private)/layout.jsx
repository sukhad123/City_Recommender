"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import NavbarComponent from "../components/composite/Navbar";
import { authenticatedMenuItems } from "../../constants/Navbar/constants";
import { UserProvider, useUser } from "./context/userContext.js";

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = useAuth();

  return (
    <UserProvider>
      <LayoutContent auth={auth} router={router}>
        {children}
      </LayoutContent>
    </UserProvider>
  );
}

function LayoutContent({ auth, router, children }) {
  const { userInfo, loading } = useUser();

  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  // Render nothing while auth or userInfo is loading, or while redirecting
  if (loading || auth.isLoading || !auth.isAuthenticated) return null;

  return (
    <NavbarComponent
      isAuthenticated={true}
      menuItems={authenticatedMenuItems}
      userInfo={userInfo}
    >
      {children}
    </NavbarComponent>
  );
}
