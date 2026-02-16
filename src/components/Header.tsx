"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Loader2 } from "lucide-react";
import { publicationApi, PublishedArticle } from "@/services/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublishedArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Live search logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await publicationApi.searchArticles({
          query: searchQuery.trim(),
          limit: 6,
        });
        setSearchResults(response.data || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setIsSearchOpen(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/current-issue", label: "Current Issue" },
    { href: "/archives", label: "Archives" },
    { href: "/for-authors", label: "For Authors" },
    { href: "/about", label: "About" },
  ];

  const linkClass = (path: string) =>
    `relative font-medium pb-1 border-b-2 transition-colors ${
      pathname === path
        ? "font-bold border-journal-rose text-journal-rose"
        : "border-transparent text-white hover:text-journal-rose hover:border-journal-rose"
    }`;

  return (
    <header className="bg-journal-maroon text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between h-20">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
              <Image
                src="/uniben-logo.png"
                alt="University of Benin Logo"
                width={48}
                height={48}
                className="rounded"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] md:text-xs font-semibold text-journal-rose mb-0.5 tracking-wide">
                UNIVERSITY OF BENIN
              </div>
              <h1 className="text-sm md:text-base lg:text-lg font-bold leading-tight transition-colors group-hover:text-journal-rose">
                Journal of Humanities
              </h1>
              <p className="text-[10px] md:text-xs text-journal-rose font-medium mt-0.5">
                Open Access • Peer Reviewed
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}

            {/* Search Toggle */}
            {!isHomePage && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Submit Button */}
            <Link
              href="/submission"
              className="bg-white text-journal-maroon px-4 py-2 rounded-full font-semibold hover:bg-journal-rose transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              Submit Manuscript
            </Link>
          </nav>

          {/* Mobile Menu + Search */}
          <div className="lg:hidden flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            )}
            <button
              className="flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!isHomePage && isSearchOpen && (
          <div className="pb-4 animate-fade-in relative" ref={searchContainerRef}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search articles, authors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                className="w-full px-6 py-3 pl-12 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                autoFocus
              />
              {isSearching ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-journal-maroon px-6 py-2 rounded-full font-semibold hover:bg-journal-rose transition-colors"
              >
                Search
              </button>
            </div>

            {/* Results Dropdown - Full Width */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[60]">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((article) => (
                      <Link
                        key={article._id}
                        href={`/articles/${article._id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="block p-4 hover:bg-journal-off-white transition-colors group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-journal-text-dark text-sm md:text-base line-clamp-1 group-hover:text-journal-maroon mb-1">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">
                              {article.author?.name} • Vol {article.volume?.volumeNumber}, Issue {article.issue?.issueNumber}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-journal-maroon bg-journal-rose px-2 py-0.5 rounded">
                            {article.articleType.replace("_", " ")}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full p-3 text-center text-sm font-bold text-journal-maroon hover:bg-journal-off-white transition-colors"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 italic">No articles found matching &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-journal-maroon-dark border-t border-white/10 animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-2 pb-1 border-b-2 ${
                pathname === "/search"
                  ? "font-bold border-journal-rose text-journal-rose"
                  : "border-transparent text-white hover:text-journal-rose hover:border-journal-rose"
              }`}
            >
              <Search size={20} /> Advanced Search
            </Link>

            <Link
              href="/submission"
              onClick={() => setIsMenuOpen(false)}
              className="bg-white text-journal-maroon px-6 py-3 rounded-full font-semibold hover:bg-journal-rose transition-all text-center shadow-lg hover:shadow-xl"
            >
              Submit Manuscript
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}