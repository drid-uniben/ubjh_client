"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, withAdminAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Newspaper,
  Users,
  Menu,
  X,
  BookUser,
  LinkIcon,
  UserCheck,
  Mail,
  AlertTriangle,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Manuscripts",
    href: "/admin/manuscripts",
    icon: FileText,
  },
  {
    name: "Author Invitations",
    href: "/admin/author-invite",
    icon: LinkIcon,
  },
  {
    name: "Reviewer Invitations",
    href: "/admin/reviewer-invite",
    icon: LinkIcon,
  },
  {
    name: "Authors",
    href: "/admin/authors",
    icon: Users,
  },
  {
    name: "Reviewers",
    href: "/admin/reviewers",
    icon: UserCheck,
  },
  { 
    name: 'All Reviews',
    href: '/admin/reviews',
    icon: FileText 
  },
  { 
    name: 'Admin Assignments', 
    href: '/admin/assignments', 
    icon: FileText 
  },
  { 
    name: 'Final Decision', 
    href: '/admin/decisions', 
    icon: BookUser 
  },
  {
  name: "Email Campaign",
  href: "/admin/email-campaign",
  icon: Mail,
},
{ 
    name: 'Override Decision', 
    href: '/admin/override-decision', 
    icon: AlertTriangle
  },

];

const bottomItems = [
  {
    name: "Background Jobs",
    href: "/admin/jobs",
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutComponent({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isArticleDropdownOpen, setIsArticleDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const dynamicRoutes = [
    "/admin/manuscripts",
    "/admin/reviews",
    "/admin/assignments",
    "/admin/decisions",
  ];

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

  const ArticleDropdown = () => {
    const articleLinks = [
      { name: "Publication", href: "/admin/articles/publication" },
      { name: "Volume", href: "/admin/articles/volume" },
      { name: "Issues", href: "/admin/articles/issues" },
    ];
  
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsArticleDropdownOpen(!isArticleDropdownOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isArticleDropdownOpen
              ? "bg-journal-maroon-dark text-white"
              : "text-journal-rose hover:bg-journal-maroon-dark hover:text-white"
          )}
        >
          <div className="flex items-center space-x-3">
            <Newspaper className="h-5 w-5 flex-shrink-0" />
            <span>Articles</span>
          </div>
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              isArticleDropdownOpen && "transform rotate-90"
            )}
          />
        </button>
        {isArticleDropdownOpen && (
          <div className="pl-4 space-y-1">
            {articleLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-journal-maroon-dark text-white"
                    : "text-journal-rose hover:bg-journal-maroon-dark hover:text-white"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
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
                  {user.name?.charAt(0) || user.email?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-journal-rose truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3 overflow-y-auto">
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
            <ArticleDropdown />
          </nav>

          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
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
                  {user.name?.charAt(0) || user.email?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-journal-rose truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3 overflow-y-auto">
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
            <ArticleDropdown />
          </nav>

          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
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
                  {user.name?.charAt(0) || user.email?.charAt(0) || "A"}
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

export const AdminLayout = withAdminAuth(AdminLayoutComponent);