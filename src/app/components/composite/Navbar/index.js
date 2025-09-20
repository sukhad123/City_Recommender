//Reusable Navbar
"use client";
import React from "react";
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

export default function NavbarComponent({
  menuItems,
  isAuthenticated = false,
  children,
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
        {isAuthenticated && (
          <NavbarContent className="hidden md:flex" justify="end">
            {/**Desktop Display  */}
            {menuItems.map((item, index) => (
              <NavbarItem key={index} isActive={item.active}>
                <Link href={item.href}>{item.label}</Link>
              </NavbarItem>
            ))}
          </NavbarContent>
        )}

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {!isAuthenticated && (
          <NavbarContent className="hidden md:flex" justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="#">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="warning" href="#" variant="flat">
                Sign Up
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
      <div className="container mx-auto px-4 pt-16">
        {children}
      </div>
    </>
  );
}
