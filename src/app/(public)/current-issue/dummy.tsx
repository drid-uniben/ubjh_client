"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Share2,
  Mail,
  Users,
  Filter,
  ExternalLink,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NoCurrentIssue from "@/components/NoCurrentIssue";
import { dummyCurrentIssue } from "@/dummy"; // Import dummy data

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

interface CurrentIssueData {
  issue: IIssue & { volume: { volumeNumber: number; coverImage?: string } };
  articles: PublishedArticle[];
}
export interface IIssue {
  volume: { volumeNumber: number; coverImage?: string };
  issueNumber: number;
  publishDate: Date;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function CurrentIssueDummyPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [currentIssueData, setCurrentIssueData] = useState<CurrentIssueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noIssueFound, setNoIssueFound] = useState(false);

  useEffect(() => {
    const loadDummyData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset any previous errors
  
        // Simulate fetching data
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        if (!dummyCurrentIssue) {
          throw new Error("No current issue data found.");
        }
  
        setCurrentIssueData(dummyCurrentIssue);
        setNoIssueFound(false);
      } catch (err: unknown) {
        console.error("Error loading current issue:", err);
      
        // Safely extract error message
        let errorMessage = "An unexpected error occurred while loading the issue.";
      
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
      
        setError(errorMessage);
        setNoIssueFound(true);
      }
      finally {
        setIsLoading(false);
      }
    };
  
    loadDummyData();
  }, []); 

  const filteredArticles =
    filterType === "all"
      ? currentIssueData?.articles || []
      : (currentIssueData?.articles || []).filter(
          (article) => article.articleType === filterType
        );

  const articleTypes = ["all", "Research Article", "Review Article", "Book Review"]; // Assuming these are the types

  const truncateAbstract = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    const partial = words.slice(0, wordLimit).join(" ");
    const rest = text.slice(partial.length);
    const periodIndex = rest.indexOf(".");
    if (periodIndex === -1) return partial + "...";
    return partial + rest.slice(0, periodIndex + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7A0019]"></div>
            <p className="text-[#7A0019] font-medium">Loading current issue...</p>
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

  if (noIssueFound) {
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

  if (!currentIssueData) {
    return null; // Should not happen if noIssueFound and error are handled, but good practice
  }

  const { issue, articles } = currentIssueData;
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
      <section className="bg-gradient-to-br from-[#7A0019] to-[#5A0A1A] text-white py-12">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <Image
                  src={issue.volume.coverImage || "/issue-cover.png"}
                  alt={`Volume ${issue.volume.volumeNumber}, Issue ${issue.issueNumber} Cover`}
                  width={400}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-semibold">Current Issue</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 font-serif">
                Volume {issue.volume.volumeNumber}, Issue {issue.issueNumber} ({publishYear})
              </h1>
              <p className="text-xl text-[#FFE9EE] mb-6">
                Published: {publishMonthYear}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{totalArticles}</div>
                  <div className="text-sm text-[#FFE9EE]">Articles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{totalPages}</div>
                  <div className="text-sm text-[#FFE9EE]">Pages</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-sm text-[#FFE9EE]">Open Access</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#7A0019] transition-all">

                  <Share2 className="h-5 w-5" />
                  Share Issue
                </button>

                <button className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#7A0019] transition-all">
                  <Quote className="h-5 w-5" />
                  Cite Issue
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-[#FFE9EE]">
                  <strong>ISSN:</strong> eISSN: 3121-763X (Online)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F8] border-b-2 border-[#EAD3D9] py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#212121] mb-1">Table of Contents</h2>
              <p className="text-sm text-gray-600">
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] font-medium"
              >

                {articleTypes.map((type) => (
                  <option key={type} value={type}>                    {type === "all" ? "All Article Types" : type}
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

              href={`/articles/${article._id}`} // Changed to articles-dummy

              key={article._id}

              className="block bg-white border-2 border-[#EAD3D9] rounded-xl overflow-hidden hover:shadow-xl hover:border-[#7A0019] transition-all transform hover:scale-[1.02]"

            >

              <div className="p-8">

                <div className="flex flex-wrap items-center gap-3 mb-4">

                  <span className="inline-flex items-center px-3 py-1 bg-[#FFE9EE] border border-[#E6B6C2] text-[#5A0A1A] rounded-full text-xs font-bold uppercase">
                    {article.articleType}
                  </span>
                  <span className="text-sm text-gray-500">Pages {article.pages?.start}-{article.pages?.end}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#212121] mb-4 group-hover:text-[#7A0019] transition-colors font-serif leading-tight">
                  {index + 1}. {article.title}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {article.author.name}{article.coAuthors && article.coAuthors.length > 0 && ", " + article.coAuthors.map(ca => ca.name).join(", ")}
                    </span>
                  </div>
                  {/* Affiliations are not directly available on PublishedArticle, so skipping for now */}

                  {/* <div className="text-sm text-gray-600 ml-6">

                    {article.affiliations.join(" • ")}

                  </div> */}
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-[#212121] mb-2">Abstract</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {truncateAbstract(article.abstract, 20)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-[#FAF7F8] py-12 border-t-2 border-[#EAD3D9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-[#EAD3D9] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7A0019] mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Subscribe to Alerts
              </h3>
              <p className="text-gray-700 mb-4">Get notified when new issues are published</p>
              <div className="block md:flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 mb-2 w-full md:mb-0 px-4 py-2 border-2 border-[#EAD3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                />
                <button className="bg-[#7A0019] text-white px-6 py-2 rounded-lg hover:bg-[#5A0A1A] transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 text-[#7A0019] hover:text-[#5A0A1A] font-semibold text-lg"
            >
              View All Past Issues
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
