"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

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
    <div>
      <h1>Payment Manager App</h1>
      <button
        type="button"
        className="bg-gray-100 p-2 rounded-md border border-gray-300 cursor-pointer"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}
