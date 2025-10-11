import Header from "@/components/Header";
import React from "react";

function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

export default DashboardLayout;
