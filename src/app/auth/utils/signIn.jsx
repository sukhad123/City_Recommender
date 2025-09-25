"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@heroui/react";

export default function SignInButton({ label = "Sign In" }) {
  const auth = useAuth();

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  return (
    <Button color="primary" onPress={handleSignIn}>
     {label}
    </Button>
  );
}
