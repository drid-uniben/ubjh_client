"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { publicationApi, PublishedArticle } from "@/services/api";

export default function SecondaryHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublishedArticle[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced article search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await publicationApi.searchArticles({
            query: searchQuery,
            limit: 5,
          });
          setSearchResults(response.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching articles:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  return (
    <div className="bg-[#F2E9EC] border-b border-[#EAD3D9] sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Links Section */}
          {!showMobileSearch && (
            <div className="flex items-center gap-4 md:gap-6 text-sm">
              <Link
                href="/editorial-board"
                className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors whitespace-nowrap"
              >
                Editorial Board
              </Link>
              <Link
                href="/policies"
                className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors whitespace-nowrap"
              >
                Policies
              </Link>
              <Link
                href="mailto:journalhumanities@uniben.edu"
                className="text-[#7A0019] hover:text-[#5A0A1A] font-medium transition-colors whitespace-nowrap hidden sm:block"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Search Section */}
          <div className={`flex items-center gap-2 ${showMobileSearch ? "w-full" : "w-auto"}`} ref={containerRef}>
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-64 px-4 py-2 pl-10 rounded-full border border-[#5A0A1A] focus:outline-none focus:ring-2 focus:ring-[#7A0019] text-black text-sm transition-all"
              />
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7A0019] animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>

            {/* Mobile Search Toggle */}
            <div className="md:hidden flex items-center w-full">
              {!showMobileSearch ? (
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="p-2 text-[#7A0019] ml-auto"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 rounded-full border border-[#5A0A1A] focus:outline-none focus:ring-2 focus:ring-[#7A0019] text-black text-sm"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowMobileSearch(false)}
                    className="p-2 text-[#7A0019]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Results */}
            {showResults && (
              <div className="absolute top-full right-0 md:right-8 mt-1 w-full md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <Loader2 className="animate-spin h-6 w-6 border-b-2 border-[#7A0019] mx-auto" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((article) => (
                      <Link
                        key={article._id}
                        href={`/articles/${article._id}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                          setShowMobileSearch(false);
                        }}
                        className="block p-4 hover:bg-[#FAF7F8] transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {article.author?.name} • Vol {article.volume?.volumeNumber}, Issue {article.issue?.issueNumber}
                        </p>
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                        setShowMobileSearch(false);
                      }}
                      className="block p-3 text-center text-sm text-[#7A0019] hover:bg-gray-50 font-bold"
                    >
                      View all results
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No articles found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
