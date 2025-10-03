import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Unauthorized() {
  return (
      <div>
        <h2 className="text-red-500">Unauthorized</h2>
        <p>Please log in to access this page.</p>

        <Button>
          <Link href={"/login"}>Log in</Link>
        </Button>
      </div>
  );
}
