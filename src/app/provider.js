"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
{
  /**Providers client
  Any children being will still be server side*/
}

import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "react-oidc-context";
import { InitializeAWSCognito } from "../libs/aws/cognito/helper/initalizeCognito";
export default function Providers({ children }) {
  //Initialize the cognito auth
  const cognitoAuth = InitializeAWSCognito();
  return (
    <AuthProvider {...cognitoAuth}>
      <HeroUIProvider>
        {" "}
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </AuthProvider>
  );
}
