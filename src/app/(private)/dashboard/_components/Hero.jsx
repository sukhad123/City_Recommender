"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Avatar,
  Spacer
} from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { City, User, Compass } from "lucide-react";

export default function Hero({ email }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen   from-blue-50   to-blue-100 p-1">
      <Card shadow="lg" radius="lg" className="w-full max-w-md  backdrop-blur-md">
        <CardHeader className="flex flex-col items-center text-center space-y-3">
          
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome 👋</h1>
            <p className="text-sm text-default-500 mt-1">{email}</p>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="text-center space-y-4">
          <p className="text-default-600 leading-relaxed">
            You’re signed in to <strong>City Recommender</strong>.
            Discover Canadian cities that fit your lifestyle, goals, and opportunities.
          </p>
          <Spacer y={2} />
          <p className="text-small text-default-500 italic">
            Start your journey toward finding your perfect city match 🏙️
          </p>
        </CardBody>

        <Divider />

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            color="primary"
            variant="solid"
            fullWidth
            startContent={<Compass size={18} />}
            onPress={() => alert("City search coming soon!")}
          >
           
          </Button>

          <Button
            color="secondary"
            variant="flat"
            fullWidth
            startContent={<User size={18} />}
            onPress={() => router.push("/profile-update")}
          >
            Update Profile
          </Button>

          <Link href="/userPreferences" className="w-full sm:w-auto">
            <Button color="success" variant="flat" fullWidth  startContent={<Compass size={18} />}>
             Find My City
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
