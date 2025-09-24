"use client";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "react-oidc-context";
import { InitializeAWSCognito } from "../libs/aws/cognito/helper/initalizeCognito";
export default function Providers({ children }) {
  const cognitoAuth = InitializeAWSCognito();

  return (
    <AuthProvider {...cognitoAuth}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </AuthProvider>
  );
}
