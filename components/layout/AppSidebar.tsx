"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Scroll,
  Scale,
  CalendarCheck,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AppSidebarProps {
  user: {
    userId: string;
    name: string;
    email: string;
  };
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Constitution", href: "/constitution", icon: Scroll },
    { label: "Decision Journal", href: "/decisions", icon: Scale },
    { label: "Weekly Reflection", href: "/reflections", icon: CalendarCheck },
    { label: "Version History", href: "/versions", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-paper-raised)] border-r border-[var(--color-border)] select-none">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[var(--color-forest)]" />
          <span className="font-serif text-sm tracking-[0.18em] font-bold text-[var(--color-ink)]">
            CONSTITUTION
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <span className="px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted)]">
          WORKSPACE
        </span>
        <div className="pt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors duration-150 ${
                  isActive
                    ? "bg-[var(--color-surface-secondary)] text-[var(--color-forest)] font-semibold shadow-2xs"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-secondary)]/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--color-forest)]" : "text-[var(--color-muted)]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[var(--color-border)] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-forest)] text-[var(--color-paper-raised)] font-serif font-semibold text-sm flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-[var(--color-muted)] truncate">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5 rounded transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="no-print hidden md:block w-64 h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Trigger Bar */}
      <div className="no-print md:hidden flex items-center justify-between p-4 bg-[var(--color-paper-raised)] border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-forest)]" />
          <span className="font-serif text-sm tracking-[0.15em] font-semibold text-[var(--color-ink)]">
            CONSTITUTION
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded text-[var(--color-ink)] hover:bg-[var(--color-surface-secondary)]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

