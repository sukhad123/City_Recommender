"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from "@heroui/react";

export default function Hero({email}) {
  return (
    <div className="flex items-center justify-center min-h-screen  p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome 👋</h1>
          <p className="text-gray-600 mt-1">{email}</p>
        </CardHeader>

        <CardBody className="space-y-4 text-center">
          <p className="text-gray-700">
            You’re signed in to <strong>City Recommender</strong>.  
            Start exploring Canadian cities tailored to your lifestyle, career, and goals.
          </p>
        </CardBody>

        <CardFooter className="flex flex-col space-y-3">
          <Button color="primary" onPress={() => alert("City search coming soon!")}>
            Find My City
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

}