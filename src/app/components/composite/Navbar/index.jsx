//Reusable Navbar
"use client";
import React, { useContext } from "react";
import Drop_Down_navbar from "./components/profile_dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { useAuth } from "react-oidc-context";
import { useAuthInfo } from "../../../auth/utils/getCurrentUserDetails";
import { signOut } from "../../../auth/utils/signOut";


export default function NavbarComponent({
  menuItems,
  isAuthenticated,
  children,
  userInfo,
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const auth = useAuth();
  const user = useAuthInfo();
  console.log("Navbar User Info:", userInfo);
  console.log(auth);

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="sm:hidden pr-3" justify="start">
          <NavbarBrand>
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              style={{ color: "white", cursor: "pointer", fontWeight: "bold" }}
            >
              City Recommender
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
             <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              style={{ color: "white", cursor: "pointer", fontWeight: "bold" }}
            >
              City Recommender
            </Link>
          </NavbarBrand>
        </NavbarContent>
        {isAuthenticated && (
          <NavbarContent className="" justify="end">
            {userInfo?.image && (
                <Link href="/profile-update" className="inline-block">
                  <img
                    src={userInfo.image}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                    alt={userInfo.name || "Profile"}
                  />
                </Link>)}
           
            {/**Desktop Display  */}
            {/* {menuItems.map((item, index) => (
              <NavbarItem key={index} isActive={item.active}>
                <Link href={item.link}>{item.label}</Link>
              </NavbarItem>
            ))} */}

            {/* <div className="flex items-center ml-4 space-x-2">
              {userInfo?.image ? (
                <Link href="/profile-update" className="inline-block">
                  <img
                    src={userInfo.image}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                    alt={userInfo.name || "Profile"}
                  />
                </Link>
             {userInfo?.image ? (
                <Link href="/profile-update" className="inline-block">
                  <img
                    src={userInfo.image}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                    alt={userInfo.name || "Profile"}
                  />
                </Link>
              ) : (
                <Link href="/profile-update" className="inline-block">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {userInfo?.name
                      ? userInfo.name.charAt(0).toUpperCase()
                      : ""}
                  </div>
                </Link>
              )}
              <Link
                href="/profile-update"
                style={{ color: "white", cursor: "pointer" }}
              >
                <span className="font-medium">{userInfo?.name}</span>
              </Link>
            </div> */}

            {/* <Button
              onPress={() => {
                auth.removeUser();
                signOut();
              }}
            >
              Logout
            </Button> */}
            <Drop_Down_navbar  menuItems={menuItems} user ={userInfo} auth={auth}/>
          </NavbarContent>
        )}
 
        {!isAuthenticated && (
          <NavbarContent className="hidden md:flex" justify="end">
            <NavbarItem>
              <Button
                as={Link}
                color="warning"
                onPress={() => {
                  auth.signinRedirect();
                }}
                variant="flat"
              >
                Get Started
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}

      
      </Navbar>
      <div className="container mx-auto px-4 pt-16">{children}</div>
    </>
  );
}