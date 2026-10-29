import React from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-[var(--color-paper)] overflow-hidden">
      <AppSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

