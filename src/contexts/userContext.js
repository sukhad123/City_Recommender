"use client";
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const idToken = localStorage.getItem("id_token");
    if (idToken) {
      import("jwt-decode").then(({ default: jwtDecode }) => {
        const decoded = jwtDecode(idToken);
        setUser({
          email: decoded.email,
        //   name: decoded.name,
          // add other claims as needed
        });
      }).catch(() => setUser(null));
    }
  }, []);

  // Function to clear user on logout (optional)
  function logout() {
    localStorage.clear();
    setUser(null);
    window.location.href = `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_OUT)}`;
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
