"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  FileText,
  Download,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicationApi } from "@/services/api";

interface Issue {
  _id: string;
  issueNumber: number;
  publishDate: string;
  description?: string;
  articleCount: number;
}

interface Volume {
  _id: string;
  volumeNumber: number;
  year: number;
  coverImage?: string;
  description?: string;
  publishDate: string;
  issues: Issue[];
}

export default function ArchivesPage() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setIsLoading(true);
      const response = await publicationApi.getArchives();
      setVolumes(response.data);

      // Calculate totals
      let articles = 0;
      let issues = 0;
      response.data.forEach((volume: Volume) => {
        issues += volume.issues.length;
        volume.issues.forEach((issue: Issue) => {
          articles += issue.articleCount;
        });
      });
      setTotalArticles(articles);
      setTotalIssues(issues);

      // Auto-expand most recent year
      if (response.data.length > 0) {
        setExpandedYear(response.data[0].year);
      }
    } catch (error) {
      console.error("Error fetching archives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/issue-cover.png";
    if (url.startsWith("http")) return url;
    return url;
  };

  // Group volumes by year
  const volumesByYear = volumes.reduce((acc, volume) => {
    const year = volume.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(volume);
    return acc;
  }, {} as Record<number, Volume[]>);

  const years = Object.keys(volumesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7A0019]"></div>
            <p className="text-[#7A0019] font-medium">Loading archives...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#7A0019] via-[#5A0A1A] to-[#3A0010] text-white py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold">Complete Collection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-serif animate-slide-up">
              Journal Archives
            </h1>
            
            <p className="text-xl md:text-2xl text-[#FFE9EE] max-w-3xl mx-auto leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Explore our complete collection of published research in the humanities
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-2">{volumes.length}</div>
                <div className="text-sm text-[#FFE9EE]">Volumes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-2">{totalIssues}</div>
                <div className="text-sm text-[#FFE9EE]">Issues</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-2">{totalArticles}</div>
                <div className="text-sm text-[#FFE9EE]">Articles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm text-[#FFE9EE]">Open Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archives Content */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {years.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-[#EAD3D9]">
              <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-700 mb-3 font-serif">
                No Issues Published Yet
              </h3>
              <p className="text-gray-600 text-lg">
                Volume 1, Issue 1 will be published soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {years.map((year) => (
                <div
                  key={year}
                  className="bg-white border-2 border-[#EAD3D9] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Year Header */}
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-8 hover:bg-gradient-to-r hover:from-[#7A0019]/5 hover:to-transparent transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {volumesByYear[year].reduce(
                            (sum, vol) => sum + vol.issues.length,
                            0
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-[#7A0019]" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h2 className="text-3xl font-bold text-[#7A0019] font-serif group-hover:text-[#5A0A1A] transition-colors">
                          {year}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {volumesByYear[year].reduce(
                            (sum, vol) => sum + vol.issues.length,
                            0
                          )}{" "}
                          issue
                          {volumesByYear[year].reduce(
                            (sum, vol) => sum + vol.issues.length,
                            0
                          ) !== 1
                            ? "s"
                            : ""}{" "}
                          •{" "}
                          {volumesByYear[year].reduce(
                            (sum, vol) =>
                              sum +
                              vol.issues.reduce(
                                (iSum, issue) => iSum + issue.articleCount,
                                0
                              ),
                            0
                          )}{" "}
                          articles
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {expandedYear === year ? (
                        <ChevronUp className="h-8 w-8 text-[#7A0019] group-hover:scale-110 transition-transform" />
                      ) : (
                        <ChevronDown className="h-8 w-8 text-[#7A0019] group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedYear === year && (
                    <div className="border-t-2 border-[#EAD3D9] bg-gradient-to-b from-[#FAF7F8] to-white p-6 sm:p-8 animate-fade-in">
                      <div className="grid gap-6">
                        {volumesByYear[year].map((volume) =>
                          volume.issues.map((issue) => (
                            <Link
                              key={issue._id}
                              href={`/current-issue`}
                              className="group bg-white border-2 border-[#EAD3D9] rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#7A0019] transition-all duration-300 hover:-translate-y-1"
                            >
                              <div className="flex flex-col sm:flex-row gap-6 p-6">
                                {/* Cover Image */}
                                <div className="relative w-full sm:w-48 h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow">
                                  <Image
                                    src={getImageUrl(volume.coverImage)}
                                    alt={`Volume ${volume.volumeNumber}, Issue ${issue.issueNumber}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="inline-flex items-center px-4 py-1.5 bg-[#7A0019] text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                                      Volume {volume.volumeNumber}, Issue{" "}
                                      {issue.issueNumber}
                                    </span>
                                    <span className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-200">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      OPEN ACCESS
                                    </span>
                                  </div>

                                  <h3 className="text-2xl font-bold text-[#7A0019] mb-3 group-hover:text-[#5A0A1A] transition-colors font-serif">
                                    {volume.description ||
                                      `Volume ${volume.volumeNumber}, Issue ${issue.issueNumber} (${year})`}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-[#7A0019]" />
                                      <span className="font-medium">
                                        {new Date(
                                          issue.publishDate
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-[#7A0019]" />
                                      <span className="font-medium">
                                        {issue.articleCount} articles
                                      </span>
                                    </div>
                                  </div>

                                  {issue.description && (
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                      {issue.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                    <span className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                                      <BookOpen className="h-4 w-4" />
                                      View Issue
                                    </span>
                                    <span className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#7A0019] hover:text-white transition-all">
                                      <Download className="h-4 w-4" />
                                      Download PDF
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#7A0019] to-[#5A0A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
            Can&apos;t Find What You&apos;re Looking For?
          </h3>
          <p className="text-xl text-[#FFE9EE] mb-8 leading-relaxed">
            Use our advanced search to filter articles by author, keyword, publication
            date, or article type across all issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#7A0019] px-8 py-4 rounded-full hover:bg-[#FFE9EE] transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <FileText className="h-6 w-6" />
              Advanced Search
            </Link>
            <Link
              href="/submission"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#7A0019] transition-all font-bold text-lg"
            >
              <Download className="h-6 w-6" />
              Submit Research
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}