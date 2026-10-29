"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Database, Download, LogOut, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SettingsClient: React.FC<{ userStats: any }> = ({ userStats }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[800px] mx-auto w-full space-y-8">
      <div className="space-y-1 border-b border-[var(--color-border)] pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-brass)]">
          PREFERENCES
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-normal text-[var(--color-ink)] mt-1">
          Settings & Account
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Manage your identity, access control parameters, and data footprint.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <User className="w-4 h-4 text-[var(--color-forest)]" />
            <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
              Account Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">
                Full Name
              </span>
              <p className="font-medium text-[var(--color-ink)] mt-0.5">
                {userStats?.name}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">
                Email Address
              </span>
              <p className="font-medium text-[var(--color-ink)] mt-0.5">
                {userStats?.email}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">
                Member Since
              </span>
              <p className="font-medium text-[var(--color-ink)] mt-0.5">
                {new Date(userStats?.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[var(--color-muted)] block">
                Workspace Footprint
              </span>
              <p className="font-medium text-[var(--color-ink)] mt-0.5">
                {userStats?._count.constitutions} constitutions &bull; {userStats?._count.decisions} decisions &bull; {userStats?._count.reflections} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <Shield className="w-4 h-4 text-[var(--color-forest)]" />
            <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
              Security & Privacy
            </h2>
          </div>

          <div className="space-y-3 text-xs text-[var(--color-muted)] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[var(--color-forest)] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[var(--color-ink)]">Password hashing:</strong> Salted bcrypt hashing with 12 rounds protects your account credentials.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[var(--color-forest)] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[var(--color-ink)]">Strict cookie session:</strong> HTTP-only, SameSite=Lax, and encrypted JSON Web Tokens guard API routes from cross-site access.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[var(--color-forest)] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[var(--color-ink)]">Strict ownership isolation:</strong> All database queries enforce user authorization on the server.
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleSignOut}
            isLoading={isLoggingOut}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};

