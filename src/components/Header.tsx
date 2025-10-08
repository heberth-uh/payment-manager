"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "./Navbar";

function Header() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          toast.success("Signed out successfully");
        },
      },
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  };
  return (
    <header className="border border-b-2 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href={"/"}>Payment Manager</Link>

          <div className="flex items-center gap-5">
            <Navbar />
            {session?.user && (
              <button
                type="button"
                className="bg-gray-100 py-1 px-3 rounded-sm border border-gray-300 cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
