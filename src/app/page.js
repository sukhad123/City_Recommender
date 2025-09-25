import NavbarComponent from "./components/composite/Navbar";
import { unauthenticatedMenuItems } from "../constants/Navbar/constants.js";
import { Button } from "@heroui/react";
import Footer from "./components/Footer";
import  {Card, CardBody } from "@heroui/react";
import { Building2, Briefcase, GraduationCap, HeartPulse, Users } from "lucide-react";
import SignSignInButton from "./auth/utils/signIn"
import SignInButton from "./auth/utils/signIn";
export default function Home() {
  return (
    <>
      <NavbarComponent
        menuItems={unauthenticatedMenuItems}
        isAuthenticated={false}
      >

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20 from-blue-50 to-white space-y-6">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Find Your Perfect Canadian City
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Smart recommendations based on housing, jobs, lifestyle, and more.
        </p>
          <SignInButton label ="Continue"/>
        
      </div>

      {/* Problem + Solution */}
      <div className="px-6 py-16 text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xl font-semibold">
          Big cities are overcrowded and expensive.
        </p>
        <p className="text-gray-600">
          Smaller Canadian cities are full of opportunity, but often overlooked.
        </p>
        <p className="text-lg font-medium">
          City Recommender uses data + AI to guide you to the city that best
          fits your goals, career, and lifestyle.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12 max-w-5xl mx-auto">
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center space-y-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold">Affordable Housing</h3>
            <p className="text-sm text-gray-600 text-center">
              Discover cities with reasonable housing costs and availability.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center space-y-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold">Job Opportunities</h3>
            <p className="text-sm text-gray-600 text-center">
              See where your skills and career thrive.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center space-y-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold">Schools & Education</h3>
            <p className="text-sm text-gray-600 text-center">
              Find strong education options for you or your family.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center space-y-2">
            <HeartPulse className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold">Healthcare Access</h3>
            <p className="text-sm text-gray-600 text-center">
              Compare healthcare availability across regions.
            </p>
          </CardBody>
        </Card>
        <Card shadow="sm" className="md:col-span-2">
          <CardBody className="flex flex-col items-center space-y-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold">Lifestyle & Community</h3>
            <p className="text-sm text-gray-600 text-center">
              Match with communities that fit your culture and values.
            </p>
          </CardBody>
        </Card>
      </div>

      <Footer />
      </NavbarComponent>
    </>
  );
}
