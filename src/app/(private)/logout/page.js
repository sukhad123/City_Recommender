"use client";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function LogoutPage() {
  const auth = useAuth();

  useEffect(() => {
    auth.removeUser();

  }, []); 

  return <p>Logging out...</p>;
}
