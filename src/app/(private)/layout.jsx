"use client";

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

  if (!auth.isLoading && !auth.isAuthenticated) {
    router.push("/");
    return null;
  }

  if (loading || auth.isLoading) return null;

  return (
    <NavbarComponent isAuthenticated={true} menuItems={authenticatedMenuItems} userInfo={userInfo}>
      {children}
    </NavbarComponent>
  );
}
