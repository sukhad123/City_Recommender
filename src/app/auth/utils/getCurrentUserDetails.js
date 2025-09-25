// src/app/auth/utils/useAuthInfo.js
"use client"
import { useAuth } from "react-oidc-context";

export function useAuthInfo() {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  return {
    email: auth.user.profile?.email,
    idToken: auth.user.id_token,
    accessToken: auth.user.access_token,
    refreshToken: auth.user.refresh_token,
  };
}
