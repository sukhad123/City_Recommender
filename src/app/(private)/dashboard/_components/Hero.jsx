"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Hero({email}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen  p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome 👋</h1>
          <p className=" mt-1">{email}</p>
        </CardHeader>

        <CardBody className="space-y-4 text-center">
          <p >
            You’re signed in to <strong>City Recommender</strong>.  
            Start exploring Canadian cities tailored to your lifestyle, career, and goals.
          </p>
        </CardBody>

        <CardFooter className="flex flex-row space-x-3 justify-center">
          <Button color="primary" onPress={() => alert("City search coming soon!")}>
            Find My City
          </Button>
          <Button color="secondary" onPress={() => router.push("/profile-update")}>
            Update Profile
          </Button>
            <Link href="/userPreferences">
            <Button color="success">User Preferences</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );

}