"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, withReviewerAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  X,
  BookOpen,
  CheckSquare,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/reviewer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Assignments",
    href: "/reviewer/assignments",
    icon: FileText,
  },
  {
    name: "Completed Reviews",
    href: "/reviewer/completed",
    icon: CheckSquare,
  },
  {
    name: "Review Guideline",
    href: "/reviewer/review-guideline",
    icon: BookOpen,
  },
];

interface ReviewerLayoutProps {
  children: React.ReactNode;
}

function ReviewerLayoutComponent({ children }: ReviewerLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const dynamicRoutes = ["/reviewer/assignments"];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  const logoutItem = {
    name: "Logout",
    action: handleLogout,
    icon: LogOut,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-journal-maroon border-r border-journal-maroon-dark flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-journal-maroon-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/uniben-logo.png"
                alt="UNIBEN Logo"
                width={32}
                height={32}
                className="rounded"
              />
            </div>
            <div>
              <span className="text-base text-white font-bold">UBJH</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 h-8 w-8 text-white hover:bg-journal-maroon-dark"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {user && (
          <div className="p-4 border-b border-journal-maroon-dark">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-journal-rose rounded-full flex items-center justify-center">
                <span className="text-journal-maroon font-semibold text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "R"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-journal-rose truncate">Reviewer</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = dynamicRoutes.includes(item.href)
                ? pathname.startsWith(item.href)
                : pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-journal-maroon-dark text-white"
                      : "text-journal-rose hover:bg-journal-maroon-dark hover:text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <nav className="space-y-1">

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logoutItem.action();
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left text-journal-rose hover:bg-journal-maroon-dark hover:text-white"
            >
              <logoutItem.icon className="h-5 w-5 flex-shrink-0" />
              <span>{logoutItem.name}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex bg-journal-maroon border-r border-journal-maroon-dark flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b border-journal-maroon-dark flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src="/uniben-logo.png"
                  alt="UNIBEN Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </div>
              <div>
                <span className="text-base text-white font-bold">UBJH</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8 text-white hover:bg-journal-maroon-dark"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && user && (
          <div className="p-4 border-b border-journal-maroon-dark">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-journal-rose rounded-full flex items-center justify-center">
                <span className="text-journal-maroon font-semibold text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "R"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-journal-rose truncate">Reviewer</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = dynamicRoutes.includes(item.href)
                ? pathname.startsWith(item.href)
                : pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-journal-maroon-dark text-white"
                      : "text-journal-rose hover:bg-journal-maroon-dark hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <nav className="space-y-1">

            <button
              onClick={logoutItem.action}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left",
                "text-journal-rose hover:bg-journal-maroon-dark hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? logoutItem.name : undefined}
            >
              <logoutItem.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{logoutItem.name}</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            id="mobile-menu-button"
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-journal-maroon p-2 -ml-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Image
                src="/uniben-logo.png"
                alt="UNIBEN Logo"
                width={28}
                height={28}
                className="rounded"
              />
            </div>
            <div>
              <span className="text-sm text-journal-maroon font-bold">UBJH</span>
            </div>
          </div>
          <div className="w-10 h-8 flex items-center justify-end">
            {user && (
              <div className="w-8 h-8 bg-journal-rose rounded-full flex items-center justify-center">
                <span className="text-journal-maroon font-semibold text-xs">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "R"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
      </div>
    </div>
  );
}

export const ReviewerLayout = withReviewerAuth(ReviewerLayoutComponent);