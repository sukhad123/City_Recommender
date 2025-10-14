//Reusable Navbar
"use client";
import React, { useContext } from "react";
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

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="sm:hidden pr-3" justify="start">
          <NavbarBrand>
            <p className="font-bold text-inherit">City Recommender</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <p className="font-bold text-inherit">City Recommender</p>
          </NavbarBrand>
        </NavbarContent>
        {isAuthenticated && (
          <NavbarContent className="hidden md:flex" justify="end">
            {/**Desktop Display  */}

            {menuItems.map((item, index) => (
              <NavbarItem key={index} isActive={item.active}>
                <Link href={item.link}>{item.label}</Link>
              </NavbarItem>
            ))}
            <div className="flex items-center ml-4 space-x-2">
              {userInfo?.image ? (
                <img
                  src={userInfo.image}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  alt={userInfo.name || "Profile"}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : ""}
                </div>
              )}
              <span className="font-medium">{userInfo?.name}</span>
            </div>
            <Button
              onPress={() => {
                auth.removeUser();
                signOut();
              }}
            >
              Logout
            </Button>
          </NavbarContent>
        )}

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>
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

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === 2
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href={item.link}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="container mx-auto px-4 pt-16">{children}</div>
    </>
  );
}
