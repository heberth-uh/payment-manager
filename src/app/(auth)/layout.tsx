import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (session) redirect('/');
  return <main>{children}</main>;
}
