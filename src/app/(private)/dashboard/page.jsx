"use client"
import Hero from "./_components/Hero"
import {useAuthInfo} from "../../auth/utils/getCurrentUserDetails"
export default function Page()
{
    const user = useAuthInfo();
    return user && <Hero email={user.email} />;
}