import ReviewPageClient from "./components/ReviewPageClient";
import NavbarComponent from "../components/composite/Navbar";
import { unauthenticatedMenuItems } from "../../constants/Navbar/constants";

export default async function ReviewPage({ searchParams }) {

  const params = await searchParams;
  const city = params?.city || ""; 

  return (
    <>
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 space-y-6">
      <ReviewPageClient initialCity={city} />  
    </div>
    </>
  );
}
