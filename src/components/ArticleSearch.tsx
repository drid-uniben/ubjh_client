"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { publicationApi, PublishedArticle } from "@/services/api";

interface ArticleSearchProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

export default function ArticleSearch({
  placeholder = "Search articles...",
  className = "",
  inputClassName = "",
  dropdownClassName = "",
}: ArticleSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublishedArticle[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await publicationApi.searchArticles({
            query: query.trim(),
            limit: 5,
          });
          setResults(response.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching articles:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 border-[#7A0019] transition-all bg-transparent focus-within:bg-white/5 ${inputClassName}`}>
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#7A0019]" />
        ) : (
          <Search className="h-4 w-4 text-[#7A0019]" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="bg-transparent border-none outline-none w-full text-sm placeholder-[#7A0019]/60 text-[#7A0019] font-medium"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className={`absolute top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-[#EAD3D9] max-h-96 overflow-y-auto z-50 ${dropdownClassName}`}>
          {isSearching ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="animate-spin h-8 w-8 text-[#7A0019] mx-auto mb-2" />
              <p className="text-xs font-medium">Searching database...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              <div className="p-2 bg-[#FAF7F8] text-[10px] font-bold text-[#7A0019] uppercase tracking-widest">
                Matching Articles
              </div>
              {results.map((article) => (
                <Link
                  key={article._id}
                  href={`/articles/${article._id}`}
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                  className="block p-4 hover:bg-[#FFE9EE] transition-colors group"
                >
                  <h4 className="font-bold text-[#212121] text-sm line-clamp-2 mb-1 group-hover:text-[#7A0019]">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-500 font-medium">
                      {article.author?.name} • Vol {article.volume?.volumeNumber}
                    </p>
                    <span className="text-[9px] font-bold text-[#7A0019] uppercase">
                      {article.articleType.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  setShowResults(false);
                  setQuery("");
                }}
                className="block p-4 text-center text-sm text-white bg-[#7A0019] hover:bg-[#5A0A1A] font-bold transition-colors"
              >
                View all results for &quot;{query}&quot;
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-200" />
              No articles found for &quot;{query}&quot;
              <Link 
                href="/search"
                className="block mt-2 text-[#7A0019] font-bold hover:underline"
              >
                Try Advanced Search
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
