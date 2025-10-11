import Header from "@/components/Header";
import { getServerSession } from "@/lib/get-session";
import React from "react";
import Unauthorized from "../unauthorized";

async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  if (!session?.user) return <Unauthorized/>
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default DashboardLayout;
