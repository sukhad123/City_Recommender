// Auth callback to handle authentication
"use client";

import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../../components/ui/spinner";

function Page() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      //Move to this page

      router.push("/dashboard");
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading) {
    return <LoadingSpinner />;
  }
}

export default Page;
