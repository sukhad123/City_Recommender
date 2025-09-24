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

function redirectToCognitoLogin() {
  const loginUrl = `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/login?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}&response_type=code&scope=openid email profile&redirect_uri=${process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN}`;
  window.location.href = loginUrl;
}

export default function NavbarComponent({
  menuItems,
  isAuthenticated = false,
  children,
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const auth = useAuth();
  const user = ""
  if(auth)
  {
    //user = auth.user.profile.email;
  }
  
 // const user = auth.user.profile.email ?? "";
  //props

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

          <NavbarContent className="hidden md:flex" justify="end">
            {/**Desktop Display  */}
             <span>{user.email}</span>
            <Button onClick={() => { logout(); }}>
            Logout
          </Button>
            {menuItems.map((item, index) => (
              <NavbarItem key={index} isActive={item.active}>
                <Link href={item.href}>{item.label}</Link>
              </NavbarItem>
            ))}
          </NavbarContent>

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

          <NavbarContent className="hidden md:flex" justify="end">
            <NavbarItem>
              <Button as={Link} color="warning" onClick={redirectToCognitoLogin} variant="flat">
                Sign-In/Sign-Up
              </Button>
            </NavbarItem>
          </NavbarContent>

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
      <div className="container mx-auto px-4 pt-16">
        {children}
      </div>
    </>
  );
}
