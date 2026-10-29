"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Check onboarding state or route to dashboard
      if (data.data?.user?.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <BookOpen className="w-5 h-5 text-[var(--color-forest)] transition-transform group-hover:scale-105" />
            <span className="font-serif text-lg tracking-[0.15em] font-semibold text-[var(--color-ink)]">
              PERSONAL CONSTITUTION
            </span>
          </Link>
          <h1 className="font-serif text-3xl font-normal text-[var(--color-ink)] pt-4">
            Welcome back
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            Access your private declarations and decision reflections.
          </p>
        </div>

        <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-sm p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-xs text-[var(--color-danger)] rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[var(--color-forest)] hover:underline"
            >
              Create your constitution
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

