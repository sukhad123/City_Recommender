"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../contexts/userContext";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        async function exchangeCode() {
            if (!code) return;

            const body = new URLSearchParams();
            body.append("grant_type", "authorization_code");
            body.append("client_id", process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID);
            body.append("code", code);
            body.append("redirect_uri", process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN);

            try {
                const response = await fetch(`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: body.toString(),
                });

                const data = await response.json();

                if (data.error) {
                    console.error("Token exchange error:", data.error);
                    return;
                }

                localStorage.setItem("id_token", data.id_token);
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);

                const idToken = localStorage.getItem("id_token");
                const userInfo = idToken ? jwtDecode(idToken) : null;

                setUser({
                    email: userInfo.email,
                    userName: userInfo["cognito:username"],
                    name: userInfo.name
                    //Add others if needed
                });

                console.log(userInfo.email);
                console.log(userInfo["cognito:username"]);
                console.log(userInfo.name);

                router.push("/");
            } catch (error) {
                console.error("Error exchanging auth code:", error);
            }
        }

        exchangeCode();
    }, [code, router, setUser]);

    return <div>Loading...</div>;
}
