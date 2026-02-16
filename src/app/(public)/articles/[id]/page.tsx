"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Download,
  Share2,
  Calendar,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicationApi, PublishedArticle } from "@/services/api";
import ArticleNotFound from "@/components/ArticleNotFound";
import { AxiosError } from "axios";
import { toast, Toaster } from "sonner";

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [articleData, setArticleData] = useState<PublishedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleNotFound, setArticleNotFound] = useState(false);
  const [copiedDOI, setCopiedDOI] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [citationFormat, setCitationFormat] = useState("APA");

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await publicationApi.getPublishedArticle(id);
        if (response.success && response.data) {
          setArticleData(response.data);
        } else {
          setArticleNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        if (err instanceof AxiosError && err.response?.status === 404) {
          setArticleNotFound(true);
        } else {
          setError("Error loading article. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const generateCitation = (format: string) => {
    if (!articleData) return "";
    
    const { title, author, coAuthors, volume, issue, pages, publishDate, doi } = articleData;
    const year = new Date(publishDate).getFullYear();
    const authors = [author, ...(coAuthors || [])];
    const authorNames = authors.map(a => a.name).join(", ");
    const volNum = volume?.volumeNumber || "?";
    const issueNum = issue?.issueNumber || "?";
    const pageRange = pages ? `${pages.start}-${pages.end}` : "";
    const doiLink = doi ? `https://doi.org/${doi}` : "";

    switch (format) {
      case "APA":
        return `${authorNames} (${year}). ${title}. UNIBEN Journal of Humanities, ${volNum}(${issueNum})${pageRange ? ", " + pageRange : ""}. ${doiLink}`;
      case "MLA":
        return `${authorNames}. "${title}." UNIBEN Journal of Humanities, vol. ${volNum}, no. ${issueNum}, ${year}${pageRange ? ", pp. " + pageRange : ""}.`;
      case "Chicago":
        return `${authorNames}. "${title}." UNIBEN Journal of Humanities ${volNum}, no. ${issueNum} (${year})${pageRange ? ": " + pageRange : ""}. ${doiLink}`;
      case "Harvard":
        return `${authorNames}, ${year}. ${title}. UNIBEN Journal of Humanities, ${volNum}(${issueNum})${pageRange ? ", pp." + pageRange : ""}.`;
      default:
        return "";
    }
  };

  const copyDOI = () => {
    if (articleData?.doi) {
      navigator.clipboard.writeText(`https://doi.org/${articleData.doi}`);
      setCopiedDOI(true);
      toast.success("DOI copied to clipboard!");
      setTimeout(() => setCopiedDOI(false), 2000);
    }
  };

  const handleShareArticle = () => {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: articleData?.title,
            text: articleData?.abstract,
            url: url,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        toast.success("Article link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-journal-maroon"></div>
            <p className="text-journal-maroon font-medium">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="text-center text-red-600 font-medium">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (articleNotFound || !articleData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="py-20 mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleNotFound />
        </div>
        <Footer />
      </div>
    );
  }

  const { articleType, title, abstract, keywords, doi, volume, issue, pages, author, coAuthors, publishDate, pdfFile } = articleData;

  const allAuthors = [author, ...(coAuthors || [])];

  const normalizeType = (type: string) => {
    if (!type) return "";
    return type.toLowerCase().replace(/_/g, " ");
  };

  // Permanent link to the issue this article belongs to
  const issueLink = `/current-issue?issueId=${issue?._id}&volumeId=${volume?._id}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-journal-off-white border-b border-journal-mauve py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-journal-maroon">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={issueLink} className="hover:text-journal-maroon">
              Volume {volume?.volumeNumber || '?'}, Issue {issue?.issueNumber || '?'} ({new Date(publishDate).getFullYear()})
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium line-clamp-1">Article</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-bold uppercase">
                  {normalizeType(articleType)}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                  OPEN ACCESS
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                  PEER REVIEWED
                </span>
              </div>

              <h1 className="text-4xl font-bold text-journal-text-dark mb-6 leading-tight font-serif">
                {title}
              </h1>

              <div className="mb-6">
                {allAuthors.map((auth, idx) => (
                  <div key={idx} className="flex items-start gap-3 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-journal-text-dark">{auth.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b-2 border-journal-mauve">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Published:</strong> {new Date(publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>

              {doi && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-semibold text-gray-700">DOI:</span>
                  <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">{doi}</code>
                  <button onClick={copyDOI} className="inline-flex items-center gap-1 text-journal-maroon hover:text-journal-maroon-dark text-sm font-semibold">
                    {copiedDOI ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-8">
                {pdfFile && (
                  <a href={pdfFile} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-journal-maroon text-white px-6 py-3 rounded-lg hover:bg-journal-maroon-dark transition-colors font-semibold">
                    <Download className="h-5 w-5" /> Download PDF
                  </a>
                )}
                <button 
                  onClick={handleShareArticle}
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-journal-maroon text-journal-maroon px-6 py-3 rounded-lg hover:bg-journal-maroon hover:text-white transition-all font-semibold"
                >
                  {copiedLink ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                  Share Article
                </button>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-journal-maroon mb-4 font-serif">Abstract</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{abstract}</p>
              {keywords && keywords.length > 0 && (
                <div className="bg-journal-off-white rounded-lg p-4">
                  <h3 className="font-semibold text-journal-text-dark mb-2">Keywords:</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-journal-mauve text-gray-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-journal-maroon mb-4 font-serif">How to Cite This Article</h2>
              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <div className="flex gap-2 mb-4">
                  {["APA", "MLA", "Chicago", "Harvard"].map((format) => (
                    <button
                      key={format}
                      onClick={() => setCitationFormat(format)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        citationFormat === format ? "bg-journal-maroon text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
                <div className="bg-journal-off-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 font-mono leading-relaxed">
                    {generateCitation(citationFormat)}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <BookOpen className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">Open Access License</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    This is an open access article distributed under the terms of the <strong>Creative Commons Attribution License (CC BY 4.0)</strong>, which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.
                  </p>
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 font-semibold text-sm">
                    Learn more about CC BY 4.0 <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <h3 className="text-lg font-bold text-journal-maroon mb-4">Published In</h3>
                <div className="mb-4 text-sm text-gray-600">
                  <p className="mb-1"><strong>Journal:</strong> UNIBEN Journal of Humanities</p>
                  <p className="mb-1"><strong>Volume/Issue:</strong> {volume?.volumeNumber || '?'}({issue?.issueNumber || '?'})</p>
                  <p className="mb-1"><strong>Year:</strong> {new Date(publishDate).getFullYear()}</p>
                  {pages && <p><strong>Pages:</strong> {pages.start}-{pages.end}</p>}
                </div>
                <Link href={issueLink} className="inline-flex items-center gap-2 bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-all font-semibold text-sm w-full justify-center">
                  <BookOpen className="h-4 w-4" /> View Full Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
