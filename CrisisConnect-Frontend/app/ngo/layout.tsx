import type { ReactNode } from "react";
import NgoNavbar from "./_components/NgoNavbar";

export default function NgoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NgoNavbar />
      <main className="p-4">{children}</main>
    </>
  );
}
