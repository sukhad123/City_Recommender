import NavbarComponent from "./components/composite/Navbar";
import { unauthenticatedMenuItems } from "../constants/Navbar/constants.js";
import { Button } from "@heroui/react";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
   
      <NavbarComponent menuItems={unauthenticatedMenuItems}>
        This is homepage
      </NavbarComponent>

    
      <div className="flex flex-col items-center justify-center text-center px-6 py-12 space-y-6">
        <p className="max-w-2xl text-lg text-gray-700 dark:text-black-200">
          <strong>City Recommender</strong> is a web application designed to help
          new immigrants and Canadian residents discover the best cities to live
          in based on their personal needs and preferences. By combining real
          data on housing, jobs, education, healthcare, and lifestyle with
          machine learning recommendations, the app guides users toward
          affordable and suitable locations outside overcrowded major cities.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 dark:text-black-200">
          Today, many newcomers and residents face challenges when deciding where
          to live in Canada. Major cities like Toronto and Vancouver are
          overcrowded, with high living costs, limited housing, and growing
          unemployment. This uneven distribution of people creates strain on
          resources in large cities, while many smaller cities with opportunities
          remain overlooked.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 dark:text-black-200">
          Our solution uses a recommendation system powered by data and
          learning to guide users toward the best-fit Canadian cities based on
          their goals, careers, and lifestyle needs. By highlighting affordable
          housing, job opportunities, schools, healthcare, and community services
          in smaller cities, we help individuals make informed decisions while
          supporting balanced growth across Canada.
        </p>

        <Link href="/review" passHref>
          <Button color="primary">Go to Reviews</Button>
        </Link>
      </div>

   
  <Footer />  

    </>
  );
}
