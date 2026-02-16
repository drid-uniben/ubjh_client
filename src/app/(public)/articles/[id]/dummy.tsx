"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Download,
  Share2,
  Quote,
  FileText,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import Footer from "@/components/Footer";
import ArticleNotFound from "@/components/ArticleNotFound";
import { dummyArticles } from "@/dummy"; // Import dummy data

// Define a local interface for PublishedArticle to match the dummy data structure
interface PublishedArticle {
  _id: string;
  articleType: string;
  title: string;
  abstract: string;
  keywords: string[];
  doi?: string;
  volume: { volumeNumber: number; coverImage?: string };
  issue: { issueNumber: number };
  pages: { start: number; end: number };
  author: { name: string };
  coAuthors: { name: string }[];
  publishDate: Date;
  viewers: { count: number };
  download: {file: string}
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [articleData, setArticleData] = useState<PublishedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [copiedDOI, setCopiedDOI] = useState(false);

  useEffect(() => {
    if (!id) return;
  
    const loadDummyArticle = () => {
      setIsLoading(true);
      setError(null);
      setArticleNotFound(false); // reset
  
      setTimeout(() => {
        try {
          const foundArticle = dummyArticles.find((article) => article._id === id);
          if (foundArticle) {
            setArticleData(foundArticle);
          } else {
            setArticleNotFound(true); // ✅ properly used now
          }
        } catch (err) {
          console.error("Error loading article:", err);
          setError("Something went wrong while loading the article.");
        } finally {
          setIsLoading(false);
        }
      }, 500);
    };
  
    loadDummyArticle();
  }, [id]);
  

  const copyDOI = () => {
    if (articleData?.doi) {
      navigator.clipboard.writeText(`https://doi.org/${articleData.doi}`);
      setCopiedDOI(true);
      setTimeout(() => setCopiedDOI(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="/uniben-logo.png"
                    alt="UNIBEN Logo"
                    width={48}
                    height={48}
                    className="rounded"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    UNIBEN Journal of Humanities
                  </h1>
                  <p className="text-sm text-[#FFE9EE] font-medium">
                    Article View
                  </p>
                </div>
              </div>
              <Link
                href="/current-issue" // Changed to current-issue-dummy
                className="text-white hover:text-[#FFE9EE] font-semibold"
              >
                ← Back to Issue
              </Link>
            </div>
          </div>
        </header>
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7A0019]"></div>
            <p className="text-[#7A0019] font-medium">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src="/uniben-logo.png"
                  alt="UNIBEN Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  UNIBEN Journal of Humanities
                </h1>
                <p className="text-sm text-[#FFE9EE] font-medium">
                  Article View
                </p>
              </div>
            </div>
            <Link
              href="/current-issue" // Changed to current-issue-dummy
              className="text-white hover:text-[#FFE9EE] font-semibold"
            >
              ← Back to Issue
            </Link>
          </div>
        </header>
        <div className="flex justify-center items-center py-20">
          <div className="text-center text-red-600 font-medium">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (articleNotFound) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src="/uniben-logo.png"
                    alt="UNIBEN Logo"
                    width={48}
                    height={48}
                    className="rounded"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    UNIBEN Journal of Humanities
                  </h1>
                  <p className="text-sm text-[#FFE9EE] font-medium">
                    Article View
                  </p>
                </div>
              </div>
              <Link
                href="/current-issue" // Changed to current-issue-dummy
                className="text-white hover:text-[#FFE9EE] font-semibold"
              >
                ← Back to Issue
              </Link>
            </div>
          </div>
        </header>
        <div className="py-20 mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  if (!articleData) {
    return null; // Should not happen if articleNotFound and error are handled
  }

  const { articleType, title, abstract, keywords, doi, volume, issue, author, coAuthors, publishDate } = articleData;

  const allAuthors = [author, ...(coAuthors || [])];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#7A0019] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src="/uniben-logo.png"
                  alt="UNIBEN Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  UNIBEN Journal of Humanities
                </h1>
                <p className="text-sm text-[#FFE9EE] font-medium">
                  Article View
                </p>
              </div>
            </div>
            <Link
              href="/current-issue" // Changed to current-issue-dummy
              className="text-white hover:text-[#FFE9EE] font-semibold"
            >
              ← Back to Issue
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-[#FAF7F8] border-b border-[#EAD3D9] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/"
              className="hover:text-[#7A0019]"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/current-issue" // Changed to current-issue-dummy
              className="hover:text-[#7A0019]"
            >
              Volume {volume.volumeNumber}, Issue {issue.issueNumber} ({new Date(publishDate).getFullYear()})
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Article</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold uppercase">
                  {articleType}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                  OPEN ACCESS
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                  PEER REVIEWED
                </span>
              </div>

              <h1 className="text-4xl font-bold text-[#212121] mb-6 leading-tight font-serif">
                {title}
              </h1>

              {/* Authors */}
              <div className="mb-6">
                {allAuthors.map((auth, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 mb-3 flex-wrap"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#212121]">
                          {auth.name}
                        </span>
                      </div>
                      {/* Affiliation and ORCID are not directly available on AuthorSummary, skipping for now */}
                      {/* <p className="text-sm text-gray-600">{auth.affiliation}</p>
                      {auth.orcid && (
                        <a
                          href={`https://orcid.org/${auth.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7A0019] hover:text-[#5A0A1A]"
                          aria-label="ORCID"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Publication Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b-2 border-[#EAD3D9]">
                
              </div>

              {/* DOI */}
              {doi && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-semibold text-gray-700">
                    DOI:
                  </span>
                  <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">
                    {doi}
                  </code>
                  <button
                    onClick={copyDOI}
                    className="inline-flex items-center gap-1 text-[#7A0019] hover:text-[#5A0A1A] text-sm font-semibold"
                    aria-label="Copy DOI"
                  >
                    {copiedDOI ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
              <a href={`/files/${articleData.download.file}`} download className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-8 py-2 rounded-lg transition-colors text-sm font-semibold hover:bg-[#5A0A1A]">
                
                
                <Download className="h-4 w-4" />
                Download PDF
   
              </a>
                <button className="inline-flex items-center gap-2 border-2 border-[#7A0019] text-[#7A0019] px-6 py-3 rounded-lg hover:bg-[#FFE9EE] transition-colors font-semibold">
                  <Quote className="h-5 w-5" />
                  Cite Article
                </button>
                <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Abstract */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#7A0019] mb-4 font-serif">
                Abstract
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {abstract}
              </p>
              <div className="bg-[#FAF7F8] rounded-lg p-4">
                <h3 className="font-semibold text-[#212121] mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-[#EAD3D9] text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Article Sections Navigation */}
            <section className="mb-8">
              <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#7A0019] mb-4">
                  Article Sections
                </h2>
                <nav className="space-y-2">
                  {[
                    "Introduction",
                    "Literature Review",
                    "Methodology",
                    "Findings",
                    "Discussion",
                    "Conclusion",
                    "References",
                  ].map((section, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#FAF7F8] text-gray-700 hover:text-[#7A0019] transition-colors flex items-center justify-between group"
                    >
                      <span>{section}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-[#EAD3D9]">
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Full article available in PDF format</strong>
                  </p>
                  <button className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-6 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold text-sm">
                    <FileText className="h-4 w-4" />
                    View Full Text PDF
                  </button>
                </div>
              </div>
            </section>

            {/* Declarations */}
            {/* Assuming these fields are not directly available in PublishedArticle for now */}
            {/* <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#7A0019] mb-4 font-serif">
                Declarations
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Funding
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.funding}
                  </p>
                </div>
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Conflict of Interest
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.conflictOfInterest}
                  </p>
                </div>
                <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                  <h3 className="font-semibold text-[#212121] mb-2">
                    Data Availability
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {article.dataAvailability}
                  </p>
                </div>
              </div>
            </section> */}

            {/* Copyright Notice */}
            <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <BookOpen className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">
                    Open Access License
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    This is an open access article distributed under the terms
                    of the <strong>Creative Commons Attribution License (CC BY
                    4.0)</strong>, which permits unrestricted use, distribution,
                    and reproduction in any medium, provided the original work
                    is properly cited.
                  </p>
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 font-semibold text-sm"
                  >
                    Learn more about CC BY 4.0
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Issue Info */}
              <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#7A0019] mb-4">
                  Published In
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Journal:</strong> UNIBEN Journal of Humanities
                  </p>
                </div>
                <Link
                  href="/current-issue" // Changed to current-issue
                  className="inline-flex items-center gap-2 bg-[#7A0019] text-white px-4 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold text-sm w-full justify-center"
                >
                  <BookOpen className="h-4 w-4" />
                  View Full Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer/>
    </div>
  );
}
