"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  ChevronRight,
  Users,
} from "lucide-react";
import Header from "@/components/Header"
import ArticleSearch from "@/components/ArticleSearch";
import Footer from "@/components/Footer";
import { publicationApi, PublishedArticle, Issue, Volume } from "@/services/api";

export default function HumanitiesJournalHome() {
  const [currentIssueData, setCurrentIssueData] = useState<{
    issue: Issue & { volume: Volume };
    articles: PublishedArticle[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentIssue = async () => {
      try {
        const response = await publicationApi.getCurrentIssue();
        if (response.success && response.data) {
          setCurrentIssueData(response.data);
        }
      } catch (error) {
        console.error("Error fetching current issue:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentIssue();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-journal-maroon text-white shadow-lg sticky top-0 z-50">
        <Header/>

        {/* Secondary Navigation */}
        <div className="bg-journal-blush border-b border-journal-mauve">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-6 text-sm">
                <Link
                  href="/editorial-board"
                  className="text-journal-maroon hover:text-journal-maroon-dark font-medium transition-colors"
                >
                  Editorial Board
                </Link>
                <Link
                  href="/policies"
                  className="text-journal-maroon hover:text-journal-maroon-dark font-medium transition-colors"
                >
                  Policies
                </Link>
                <Link
                  href="mailto:ubjh@uniben.edu"
                  className="text-journal-maroon hover:text-journal-maroon-dark font-medium transition-colors hidden sm:block"
                >
                  Contact
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <ArticleSearch 
                  inputClassName="border-2 border-journal-maroon focus-within:ring-2 focus-within:ring-journal-maroon/20 w-48 md:w-80"
                  placeholder="Quick search articles..."
                />
                <Link 
                  href="/search"
                  className="hidden md:flex flex-col items-center justify-center text-journal-maroon hover:bg-journal-maroon hover:text-white px-3 py-1.5 rounded-lg border border-journal-maroon transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Advanced</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-none">Search</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/academic-pattern.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Globe className="h-4 w-4" />
              <span className="text-lg font-semibold">University of Benin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-serif">
              Journal of Humanities
            </h2>
            <p className="text-xl mb-8 text-journal-rose leading-relaxed">
              Advancing scholarship in the humanities with African and global perspectives
            </p>
            <p className="text-xl mb-8 text-journal-rose leading-relaxed">
              Publishing peer-reviewed scholarship in law & society, history,
              languages, culture, philosophy, arts, and environmental
              humanities.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-semibold">Diamond Open Access</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-300" />
                <span className="font-semibold">3–6 Week Review</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Crossref DOIs</span>
              </div>
            </div>
            <div className="block md:flex gap-4">
              <Link
                href="/submission"
                className="inline-flex mb-4 md:mb-0 items-center gap-2 text-sm md:text-md bg-white text-journal-maroon px-4 py-4 md:px-8 md:py-4 rounded-full font-bold hover:bg-journal-rose transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <FileText className="h-5 w-5" />
                Submit Your Manuscript
              </Link>
              <Link
                href="/current-issue"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-journal-maroon transition-all"
              >
                <BookOpen className="h-5 w-5" />
                Browse Current Issue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest from Current Issue Section */}
      {(isLoading || (currentIssueData && currentIssueData.articles.length > 0)) && (
        <section className="py-16 bg-journal-off-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-journal-maroon mb-2 font-serif">
                  Latest from Current Issue
                </h2>
                {!isLoading && currentIssueData && (
                  <p className="text-gray-600 font-medium">
                    Volume {currentIssueData.issue.volume.volumeNumber}, Issue {currentIssueData.issue.issueNumber} ({new Date(currentIssueData.issue.publishDate).getFullYear()})
                  </p>
                )}
              </div>
              <Link
                href="/current-issue"
                className="text-journal-maroon font-bold hover:text-journal-maroon-dark flex items-center gap-2 transition-colors"
              >
                View Full Issue
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {isLoading ? (
                // Skeleton Loaders
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border-2 border-journal-mauve rounded-2xl p-8 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-20 bg-gray-100 rounded w-full mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))
              ) : (
                currentIssueData?.articles.slice(0, 2).map((article) => (
                  <Link
                    key={article._id}
                    href={`/articles/${article._id}`}
                    className="group bg-white border-2 border-journal-mauve rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-journal-maroon transition-all flex flex-col"
                  >
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {article.articleType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-journal-text-dark group-hover:text-journal-maroon transition-colors mb-4 font-serif leading-tight">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-700 mb-4 font-medium">
                      <Users className="h-4 w-4 flex-shrink-0 text-journal-maroon" />
                      <span className="line-clamp-1">{article.author.name}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6">
                      {article.abstract}
                    </p>
                    <div className="mt-auto flex items-center text-journal-maroon font-bold text-sm">
                      Read Full Article
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                About the Journal
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The <strong>UNIBEN Journal of Humanities</strong> publishes
                peer-reviewed scholarship with African and global perspectives
                in law & society, history, languages, culture, philosophy, arts,
                and environmental humanities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We welcome empirical, doctrinal, and decolonial approaches with
                policy relevance, committed to advancing knowledge that serves
                society and promotes justice, equity, and sustainable
                development.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-journal-maroon font-semibold hover:text-journal-maroon-dark text-lg"
              >
                Learn More About Our Mission
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/humanities-research.png"
                alt="Humanities research and scholarship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Publish With Us */}
      <section className="py-16 bg-journal-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-journal-maroon mb-4 font-serif">
              Why Publish With Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a growing community of scholars committed to rigorous,
              impactful, and accessible research
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle className="h-10 w-10 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                No APCs
              </h3>
              <p className="text-gray-600">
                Diamond Open Access — completely free for authors and readers
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Clock className="h-10 w-10 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                Fast Review
              </h3>
              <p className="text-gray-600">
                Rigorous peer review with 3–6 week turnaround to first decision
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Globe className="h-10 w-10 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600">
                Crossref DOIs, Google Scholar indexing, and wide distribution
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="h-10 w-10 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                Preserved Forever
              </h3>
              <p className="text-gray-600">
                Long-term archiving via PKP PN ensures permanent accessibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Leadership */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="block md:flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-journal-maroon mb-2 font-serif">
                Editorial Leadership
              </h2>
              <p className="text-gray-600 mb-4">
                Distinguished scholars committed to excellence
              </p>
            </div>
            <Link
              href="/editorial-board"
              className="text-journal-maroon font-semibold hover:text-journal-maroon-dark flex items-center gap-2"
            >
              View Full Board
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Editor-in-Chief Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-journal-maroon">
              <div className="w-20 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/editor-chiefff.png"
                  alt="Editor in Chief"
                  width={86}
                  height={86}
                  className="rounded-full"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-journal-maroon font-bold mb-1">
                  EDITOR-IN-CHIEF
                </p>
                <h3 className="text-lg font-bold text-journal-text-dark mb-1">
                  Professor Edoba B. Omoregie, SAN.
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Vice Chancellor, University of Benin
                </p>
              </div>
            </div>

            {/* Managing Editor */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-journal-mauve hover:border-journal-maroon transition-colors">
              <div className="w-24 h-22 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/managing-editorrr.png"
                  alt="Managing Editor"
                  width={98}
                  height={98}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-journal-maroon font-bold mb-1">
                  MANAGING EDITOR
                </p>
                <h3 className="text-lg font-bold text-journal-text-dark mb-1">
                  Prof. Ngozi Finette Unuigbe
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Director, DRID
                  <br />
                  University of Benin
                </p>
              </div>
            </div>

            {/* Librarian */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-journal-mauve hover:border-journal-maroon transition-colors">
              <div className="w-20 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                <Image
                  src="/librarian.png"
                  alt="Librarian"
                  width={86}
                  height={86}
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-journal-maroon font-bold mb-1">
                  ASSOCIATE EDITOR
                </p>
                <h3 className="text-lg font-bold text-journal-text-dark mb-1">
                  Professor Jane Igie Aba
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  University Librarian
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
