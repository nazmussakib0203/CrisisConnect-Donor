"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AUTH_FLOW_PATHS = ["/ngo/register", "/ngo/verify-signup", "/ngo/login"];

const LINKS = [
  { href: "/ngo/crises", label: "Crises" },
  { href: "/ngo/my-crises", label: "My Crises" },
  { href: "/ngo/calls", label: "Volunteer Calls" },
  { href: "/ngo/donation-calls", label: "Donation Calls" },
];

export default function NgoNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (AUTH_FLOW_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <nav className="flex items-center gap-4 border-b px-4 py-3">
      <Link href="/ngo" className="font-semibold">CrisisConnect NGO</Link>

      <NavigationMenu>
        <NavigationMenuList>
          {LINKS.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink render={<Link href={link.href} />}>
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" className="ml-auto" />}>
          Account
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href="/ngo/dashboard" />}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("email");
              router.push("/login");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
