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
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicationApi, Volume, Issue } from "@/services/api";
import { getVolumeImage } from "@/utils/volumeImageHelper";

interface LocalIssue extends Issue {
  articleCount: number;
}

interface LocalVolume extends Volume {
  issues: LocalIssue[];
}

export default function ArchivesPage() {
  const [volumes, setVolumes] = useState<LocalVolume[]>([]);
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
      
      const volumesData = response.data || [];
      setVolumes(volumesData);

      // Calculate totals
      let articles = 0;
      let issuesCount = 0;
      volumesData.forEach((volume: LocalVolume) => {
        issuesCount += volume.issues.length;
        volume.issues.forEach((issue: LocalIssue) => {
          articles += issue.articleCount || 0;
        });
      });
      setTotalArticles(articles);
      setTotalIssues(issuesCount);

      // Auto-expand most recent year
      if (volumesData.length > 0) {
        setExpandedYear(volumesData[0].year);
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

  // Group volumes by year
  const volumesByYear = volumes.reduce((acc, volume) => {
    const year = volume.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(volume);
    return acc;
  }, {} as Record<number, LocalVolume[]>);

  const years = Object.keys(volumesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-journal-maroon"></div>
            <p className="text-journal-maroon font-medium">Loading archives...</p>
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
      <section className="relative bg-gradient-to-br from-journal-maroon via-journal-maroon-dark to-[#3A0010] text-white py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold">Complete Collection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-serif">
              Journal Archives
            </h1>
            
            <p className="text-xl md:text-2xl text-journal-rose max-w-3xl mx-auto leading-relaxed mb-8">
              Explore our complete collection of published research in the humanities
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">{volumes.length}</div>
                <div className="text-sm text-journal-rose">Volumes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">{totalIssues}</div>
                <div className="text-sm text-journal-rose">Issues</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">{totalArticles}</div>
                <div className="text-sm text-journal-rose">Articles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archives Content */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {years.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-journal-mauve">
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
                  className="bg-white border-2 border-journal-mauve rounded-2xl overflow-hidden shadow-lg"
                >
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-journal-maroon to-journal-maroon-dark rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {volumesByYear[year].reduce(
                            (sum, vol) => sum + vol.issues.length,
                            0
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-journal-maroon" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h2 className="text-3xl font-bold text-journal-maroon font-serif group-hover:text-journal-maroon-dark transition-colors">
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
                                (iSum, issue) => iSum + (issue.articleCount || 0),
                                0
                              ),
                            0
                          )}{" "}
                          articles
                        </p>
                      </div>
                    </div>
                    <div>
                      {expandedYear === year ? (
                        <ChevronUp className="h-8 w-8 text-journal-maroon" />
                      ) : (
                        <ChevronDown className="h-8 w-8 text-journal-maroon" />
                      )}
                    </div>
                  </button>

                  {expandedYear === year && (
                    <div className="border-t-2 border-journal-mauve bg-journal-off-white p-6 sm:p-8">
                      <div className="grid gap-6">
                        {volumesByYear[year].map((volume) =>
                          volume.issues.map((issue) => (
                            <div
                              key={issue._id}
                              className="bg-white border-2 border-journal-mauve rounded-2xl overflow-hidden hover:shadow-xl hover:border-journal-maroon transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row gap-6 p-6">
                                <div className="relative w-full sm:w-48 h-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                                  <Image
  src={getVolumeImage(volume, issue.issueNumber)}
  alt={`Volume ${volume.volumeNumber}, Issue ${issue.issueNumber}`}
  fill
  className="object-cover"
/>
                                </div>

                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="inline-flex items-center px-4 py-1.5 bg-journal-maroon text-white rounded-full text-xs font-bold uppercase tracking-wide">
                                      Volume {volume.volumeNumber}, Issue {issue.issueNumber}
                                    </span>
                                    <span className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-200">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      OPEN ACCESS
                                    </span>
                                  </div>

                                  <h3 className="text-2xl font-bold text-journal-maroon mb-3 font-serif">
                                    {volume.description || `Volume ${volume.volumeNumber}, Issue ${issue.issueNumber} (${year})`}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-journal-maroon" />
                                      <span className="font-medium">
                                        {new Date(issue.publishDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-journal-maroon" />
                                      <span className="font-medium">
                                        {issue.articleCount || 0} articles
                                      </span>
                                    </div>
                                  </div>

                                  {issue.description && (
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                      {issue.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                    <Link
                                      href={`/current-issue?issueId=${issue._id}&volumeId=${volume._id}`} 
                                      className="inline-flex items-center gap-2 bg-journal-maroon text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:scale-105 transition-all"
                                    >
                                      <BookOpen className="h-4 w-4" />
                                      View Issue
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
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
      <section className="py-16 bg-gradient-to-r from-journal-maroon to-journal-maroon-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
            Can&apos;t Find What You&apos;re Looking For?
          </h3>
          <p className="text-xl text-journal-rose mb-8 leading-relaxed">
            Use our advanced search to filter articles by author, keyword, publication
            date, or article type across all issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-journal-maroon px-8 py-4 rounded-full hover:bg-journal-rose transition-all font-bold text-lg shadow-xl"
            >
              <FileText className="h-6 w-6" />
              Advanced Search
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
