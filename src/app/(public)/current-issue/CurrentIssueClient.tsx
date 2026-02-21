"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Share2,
  Users,
  Filter,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicationApi, issueApi, PublishedArticle, Issue, Volume } from "@/services/api";
import NoCurrentIssue from "@/components/NoCurrentIssue";
import { toast, Toaster } from "sonner";
import { getVolumeImage } from "@/utils/volumeImageHelper";

interface CurrentIssueClientProps {
  issueId?: string;
  volumeId?: string;
}

interface IssueData {
  issue: Issue & { volume: Volume };
  articles: PublishedArticle[];
}

export default function CurrentIssueClient({ issueId, volumeId }: CurrentIssueClientProps) {
  const [data, setData] = useState<IssueData | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const isArchiveView = !!(issueId && volumeId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (isArchiveView) {
          // ARCHIVE VIEW: Fetch articles and issue metadata in parallel
          const [articlesRes, issueRes] = await Promise.all([
            publicationApi.getArticlesByVolumeAndIssue(volumeId!, issueId!),
            issueApi.getIssueById(issueId!)
          ]);

          if (articlesRes.success && issueRes.success) {
            setData({
              issue: issueRes.data,
              articles: articlesRes.data
            });
          }
        } else {
          // STANDARD VIEW: Current issue fetch
          const response = await publicationApi.getCurrentIssue();
          if (response.success) {
            setData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching issue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [issueId, volumeId, isArchiveView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-journal-maroon"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data || !data.issue) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="py-20 mx-auto px-4 sm:px-6 lg:px-8">
          <NoCurrentIssue />
        </div>
        <Footer />
      </div>
    );
  }

  const { issue, articles } = data;
  const volume = typeof issue.volume === 'object' ? (issue.volume as Volume) : null;

  const normalizeType = (type: string) => {
    if (!type) return "";
    return type.toLowerCase().replace(/_/g, " ");
  };

  const filteredArticles =
    filterType === "all"
      ? articles || []
      : (articles || []).filter(
          (article) => normalizeType(article.articleType) === filterType.toLowerCase()
        );

  const articleTypes = ["all", "Research Article", "Review Article", "Book Review"];

  const handleShareIssue = () => {
    // Generate a PERMANENT link even for current issue
    const url = `${window.location.origin}/current-issue?issueId=${issue._id}&volumeId=${volume?._id || ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: `UNIBEN Journal of Humanities - Vol ${volume?.volumeNumber}, Issue ${issue.issueNumber}`,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success("Issue link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const totalArticles = articles.length;
  const totalPages = articles.reduce((sum, article) => {
    if (article.pages?.start && article.pages?.end) {
      return sum + (article.pages.end - article.pages.start + 1);
    }
    return sum;
  }, 0);

  const publishYear = new Date(issue.publishDate).getFullYear();
  const publishMonthYear = new Date(issue.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <section className="bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white py-12">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <Image
  src={getVolumeImage(volume, issue.issueNumber)}
  alt={`Volume ${volume?.volumeNumber || '?'}, Issue ${issue.issueNumber} Cover`}
  width={400}
  height={600}
  className="w-full h-auto"
/>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-semibold">{isArchiveView ? "Archive Issue" : "Current Issue"}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 font-serif">
                Volume {volume?.volumeNumber || '?'}, Issue {issue.issueNumber} ({publishYear})
              </h1>
              <p className="text-xl text-journal-rose mb-6">
                Published: {publishMonthYear}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{totalArticles}</div>
                  <div className="text-sm text-journal-rose">Articles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{totalPages}</div>
                  <div className="text-sm text-journal-rose">Pages</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-sm text-journal-rose">Open Access</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleShareIssue}
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-journal-maroon transition-all"
                >
                  {copiedLink ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                  Share Issue
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-journal-rose">
                  <strong>ISSN:</strong> eISSN: 3121-763X (Online)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-journal-off-white border-b-2 border-journal-mauve py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-journal-text-dark mb-1">Table of Contents</h2>
              <p className="text-sm text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-journal-mauve rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-maroon font-medium"
              >
                {articleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Article Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {filteredArticles.map((article, index) => (
            <Link
              href={`/articles/${article._id}`}
              key={article._id}
              className="block bg-white border-2 border-journal-mauve rounded-xl overflow-hidden hover:shadow-xl hover:border-journal-maroon transition-all transform hover:scale-[1.02]"
            >
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-bold uppercase">
                    {normalizeType(article.articleType)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Pages {article.pages?.start}-{article.pages?.end}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-journal-text-dark mb-4 group-hover:text-journal-maroon transition-colors font-serif leading-tight">
                  {index + 1}. {article.title}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {article.author.name}
                      {article.coAuthors && article.coAuthors.length > 0 && ", " + article.coAuthors.map(ca => ca.name).join(", ")}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-journal-text-dark mb-2">Abstract</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {(article.abstract || "").split(" ").slice(0, 20).join(" ") + "..."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
