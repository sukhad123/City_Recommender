"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import NavbarComponent from "../components/composite/Navbar";
import { authenticatedMenuItems } from "../../constants/Navbar/constants";

// import server actions
import { findUserByEmail, createUser } from "../../repositories/user";

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!auth.isLoading && auth.isAuthenticated) {
        const email = auth.user?.profile?.email;
        const name = auth.user?.profile?.name;
        if (email) {
          let user = await findUserByEmail(email);
          if (!user) {
            user = await createUser(email, name);
            console.log("Created new user:", user);
          } else {
            console.log("Found user:", user);
          }
        }
        setLoading(false);
      } else if (!auth.isLoading && !auth.isAuthenticated) {
        router.push("/");
      }
    };

    checkUser();
  }, [auth.isLoading, auth.isAuthenticated, auth.user, router]);

  if (loading) return null;

  return (
    <NavbarComponent
      isAuthenticated={true}
      menuItems={authenticatedMenuItems}
    >
      {children}
    </NavbarComponent>
  );
}
