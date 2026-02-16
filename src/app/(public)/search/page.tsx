"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Loader } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicationApi } from "@/services/api";

interface Author {
  name: string;
  email?: string;
  affiliation?: string;
}

interface Article {
  _id: string;
  title: string;
  abstract: string;
  author: Author;
  coAuthors?: Author[];
  articleType: string;
  volume: {
    volumeNumber: number;
    year: number;
  };
  issue: {
    issueNumber: number;
  };
  publishDate: string;
  doi?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterVolumeNumber, setFilterVolumeNumber] = useState("");
  const [filterIssueNumber, setFilterIssueNumber] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles based on query and filters
  useEffect(() => {
    if (query.trim().length < 2) {
      setArticles([]);
      setError(null);
      return;
    }

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await publicationApi.searchArticles({
          query: query.trim(),
          limit: 50,
          volumeNumber: filterVolumeNumber || undefined,
          issueNumber: filterIssueNumber || undefined,
          articleType: filterType || undefined,
        });
        setArticles(response.data || []);
      } catch (err) {
        setError("Failed to fetch articles. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filterType, filterVolumeNumber, filterIssueNumber]);

  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      <Header />

      {/* 🔍 Search Section */}
      <section className="bg-journal-maroon text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Search Research Articles
          </h1>
          <p className="text-journal-rose text-lg mb-6">
            Discover knowledge from UNIBEN Journal
          </p>

          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3 items-stretch">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 border-2 border-journal-maroon/30 rounded-lg px-3 py-2">
              <Search className="text-journal-maroon" />
              <input
                type="text"
                placeholder="Search by title, author, keywords or DOI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-gray-800 outline-none"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 border-2 border-journal-maroon text-journal-maroon px-4 py-2 rounded-lg hover:bg-journal-maroon hover:text-white transition-all font-semibold"
            >
              <Filter className="h-5 w-5" />
              Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-xl shadow-lg p-5 text-gray-800 border border-journal-maroon/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-journal-maroon flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => {
                    setFilterType("");
                    setFilterVolumeNumber("");
                    setFilterIssueNumber("");
                  }}
                  className="text-xs text-journal-maroon font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Article Type */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-journal-maroon">
                    Article Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-journal-maroon/30 rounded-lg focus:ring-2 focus:ring-journal-maroon"
                  >
                    <option value="">All Types</option>
                    <option value="research_article">Research Article</option>
                    <option value="review_article">Review Article</option>
                    <option value="book_review">Book Review</option>
                    <option value="case_study">Case Study</option>
                    <option value="editorial">Editorial</option>
                  </select>
                </div>

                {/* Volume Number */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-journal-maroon">
                    Volume Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={filterVolumeNumber}
                    onChange={(e) => setFilterVolumeNumber(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-journal-maroon/30 rounded-lg focus:ring-2 focus:ring-journal-maroon"
                  />
                </div>

                {/* Issue Number */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-journal-maroon">
                    Issue Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={filterIssueNumber}
                    onChange={(e) => setFilterIssueNumber(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-journal-maroon/30 rounded-lg focus:ring-2 focus:ring-journal-maroon"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 📰 Results Section */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-bold text-journal-maroon mb-2">
            Search Results
          </h2>
          
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader className="h-5 w-5 animate-spin text-journal-maroon" />
              Searching database...
            </div>
          )}

          {error && (
            <p className="text-red-600 mb-6">{error}</p>
          )}

          {!isLoading && !error && (
            <p className="text-gray-700 mb-6">
              {query.trim().length < 2
                ? "Enter at least 2 characters to search"
                : `Found ${articles.length} ${
                    articles.length === 1 ? "article" : "articles"
                  }`}
            </p>
          )}

          <div className="space-y-5">
            {articles.map((article) => {
              const allAuthors = [
                article.author,
                ...(article.coAuthors || []),
              ];
              const authorNames = allAuthors
                .map((a) => a.name)
                .join(", ");
              const issueLabel = `Vol ${article.volume.volumeNumber}, Issue ${article.issue.issueNumber}`;

              return (
                <Link
                  key={article._id}
                  href={`/articles/${article._id}`}
                  className="block bg-white border-2 border-journal-maroon/20 rounded-xl p-5 hover:border-journal-maroon hover:shadow-xl transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <span className="inline-flex px-3 py-1 bg-journal-maroon text-white text-xs font-bold rounded-full capitalize">
                      {article.articleType.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">{issueLabel}</span>
                  </div>
                  <h3 className="text-xl font-bold text-journal-maroon mb-2 hover:underline">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2 font-medium">
                    {authorNames}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {article.abstract}
                  </p>
                  {article.doi && (
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      DOI: {article.doi}
                    </p>
                  )}
                </Link>
              );
            })}

            {!isLoading &&
              !error &&
              query.trim().length >= 2 &&
              articles.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-600 italic">No matching results found in the database.</p>
                </div>
              )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-journal-maroon" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
