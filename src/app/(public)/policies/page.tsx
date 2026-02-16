"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Lock,
  Globe,
  BookOpen,
  Database,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function PoliciesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("open-access");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "open-access",
      title: "Open Access & Licensing",
      icon: Globe,
      color: "#7A0019",
    },
    {
      id: "peer-review",
      title: "Peer Review",
      icon: Users,
      color: "#7A0019",
    },
    {
      id: "ethics",
      title: "Publication Ethics",
      icon: Shield,
      color: "#7A0019",
    },
    {
      id: "data",
      title: "Data & Materials",
      icon: Database,
      color: "#7A0019",
    },
    {
      id: "copyright",
      title: "Copyright & Self-Archiving",
      icon: Lock,
      color: "#7A0019",
    },
    {
      id: "plagiarism",
      title: "Plagiarism & Similarity Screening",
      icon: AlertCircle,
      color: "#7A0019",
    },
    {
      id: "apcs",
      title: "Article Processing Charges",
      icon: CheckCircle,
      color: "#7A0019",
    },
    {
      id: "indexing",
      title: "Indexing & Persistent Identifiers",
      icon: BookOpen,
      color: "#7A0019",
    },
    {
      id: "archiving",
      title: "Archiving & Preservation",
      icon: FileText,
      color: "#7A0019",
    },
  ];
  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-journal-maroon text-white shadow-lg sticky top-0 z-50">
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
                <p className="text-sm text-journal-rose font-medium">
                  Editorial Policies
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-white hover:text-journal-rose font-semibold"
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Transparency & Accountability
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Editorial Policies
            </h1>
            <p className="text-xl text-journal-rose leading-relaxed">
              Our commitment to ethical publishing, quality assurance, and open
              science
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <h2 className="text-lg font-bold text-journal-maroon mb-4">
                  Policy Sections
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => toggleSection(section.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        expandedSection === section.id
                          ? "bg-journal-maroon text-white"
                          : "hover:bg-journal-off-white text-gray-700"
                      }`}
                    >
                      <section.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* COPE Badge */}
              <div className="mt-6 bg-journal-off-white border-2 border-journal-mauve rounded-xl p-6 text-center">
                <Shield className="h-12 w-12 text-journal-maroon mx-auto mb-3" />
                <p className="text-sm text-gray-700 mb-3">
                  We follow the <strong>COPE Core Practices</strong> for ethical
                  publishing
                </p>
                <a
                  href="https://publicationethics.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-journal-maroon hover:text-journal-maroon-dark font-semibold flex items-center justify-center gap-1"
                >
                  Visit COPE
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Open Access & Licensing */}
            <section
              id="open-access"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "open-access"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("open-access")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Open Access & Licensing
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "open-access" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "open-access" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    This journal is fully open access. Authors retain copyright
                    and publish under the{" "}
                    <strong>Creative Commons Attribution (CC BY 4.0)</strong>{" "}
                    licence. No embargoes. Readers may read, share, and reuse with
                    attribution.
                  </p>
                  <div className="bg-green-50 border-l-4 border-journal-maroon p-4 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Aligned with Plan S/open-access best practice:</strong>{" "}
                      We support the global movement toward immediate, unrestricted
                      access to research.
                    </p>
                  </div>
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-journal-maroon hover:text-journal-maroon-dark font-semibold"
                  >
                    Learn more about CC BY 4.0
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </section>

            {/* Peer Review */}
            <section
              id="peer-review"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "peer-review"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("peer-review")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Peer Review
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "peer-review" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "peer-review" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Double-anonymous review:</strong> At least two
                    external reviewers per submission.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Typical timelines:</strong> 3–6 weeks to first
                    decision. Editors may request a third review in cases of
                    disagreement. Exceptions (e.g., editorials) are clearly
                    labelled.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-journal-rose border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-2">
                        Review Criteria
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Originality and significance</li>
                        <li>• Methodological rigor</li>
                        <li>• Clarity of argument</li>
                        <li>• Contribution to field</li>
                        <li>• Quality of sources/evidence</li>
                      </ul>
                    </div>
                    <div className="bg-journal-rose border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-2">
                        Possible Outcomes
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Accept (no revisions)</li>
                        <li>• Minor revisions required</li>
                        <li>• Major revisions required</li>
                        <li>• Reject (with feedback)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Publication Ethics */}
            <section
              id="ethics"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "ethics"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("ethics")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Publication Ethics
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "ethics" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "ethics" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We follow the{" "}
                    <a
                      href="https://publicationethics.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-journal-maroon font-semibold hover:underline"
                    >
                      COPE Core Practices
                    </a>
                    , including handling of complaints/appeals, conflicts of
                    interest, research misconduct (plagiarism, data fabrication),
                    and corrections/retractions.
                  </p>

                  <div className="bg-journal-rose border-l-4 border-journal-maroon p-4 rounded-r-lg">
                    <h3 className="font-bold text-red-900 mb-2">
                      Research Misconduct
                    </h3>
                    <p className="text-sm text-gray-700">
                      Allegations of plagiarism, data fabrication, or other forms
                      of misconduct are assessed using COPE flowcharts. Outcomes
                      (including retractions) are reported transparently on the
                      journal site.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-journal-text-dark">
                      We are committed to:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Fair and transparent handling of all submissions
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Prompt investigation of misconduct allegations
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Clear conflict of interest management
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Protecting confidentiality in review process
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Publishing corrections and retractions when necessary
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Data & Materials */}
            <section
              id="data"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "data"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("data")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Data & Materials
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "data" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "data" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All submissions must include a{" "}
                    <strong>Data Availability Statement</strong>. Where
                    ethical/legal limits apply, authors should state the
                    conditions for access.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For empirical work, authors are encouraged to share
                    datasets/code in a trusted repository with a persistent
                    identifier (e.g., Zenodo, Figshare, GitHub).
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-journal-rose border border-purple-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Best Practice
                      </h3>
                      <p className="text-sm text-gray-700">
                        Publicly share data, code, and materials whenever possible
                        to promote reproducibility and transparency.
                      </p>
                    </div>
                    <div className="bg-journal-rose border border-purple-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Restrictions
                      </h3>
                      <p className="text-sm text-gray-700">
                        If data cannot be shared (ethical/legal reasons), clearly
                        explain restrictions and access procedures.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Copyright & Self-Archiving */}
            <section
              id="copyright"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "copyright"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("copyright")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Copyright & Self-Archiving
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "copyright" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "copyright" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Authors keep copyright. Posting of preprints and Author
                    Accepted Manuscripts (AAMs) is permitted, provided the final
                    published version is linked via its DOI.
                  </p>
                  <div className="bg-journal-rose border-l-4 border-journal-maroon p-4 rounded-r-lg">
                    <h3 className="font-bold text-journal-maroon mb-2">
                      Self-Archiving Rights
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Preprints:</strong> Can be posted anytime on
                          preprint servers or institutional repositories
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>AAMs:</strong> Author Accepted Manuscripts can
                          be archived immediately upon acceptance
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Published Version:</strong> Can be shared
                          freely under CC BY 4.0 license
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Plagiarism */}
            <section
              id="plagiarism"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "plagiarism"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("plagiarism")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Plagiarism & Similarity Screening
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "plagiarism" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "plagiarism" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All submissions undergo similarity screening (e.g., Crossref
                    Similarity Check/Turnitin). Manuscripts with significant,
                    unexplained textual overlap may be rejected or retracted.
                  </p>
                  <div className="bg-journal-rose border-l-4 border-journal-maroon p-4 rounded-r-lg">
                    <h3 className="font-bold text-yellow-900 mb-2">
                      What Constitutes Plagiarism?
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Using others&apos; work without proper attribution</li>
                      <li>• Self-plagiarism (republishing your own work)</li>
                      <li>• Paraphrasing without citation</li>
                      <li>• Verbatim copying of text</li>
                      <li>• Misrepresenting sources</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Properly cited quotations and standard
                    methodological descriptions are not considered plagiarism.
                  </p>
                </div>
              )}
            </section>

            {/* APCs */}
            <section
              id="apcs"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "apcs"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("apcs")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Article Processing Charges (APCs) / Fees
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "apcs" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "apcs" && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                          No APCs (Diamond OA)
                        </h3>
                        <p className="text-gray-700">
                          This journal is completely <strong>free for both
                          authors and readers</strong>. There are no submission
                          fees, publication fees, page charges, or color charges.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    <strong>Supported by:</strong> TETFund and the University of
                    Benin. Waiver policy therefore not required; any ancillary
                    charges (e.g., colour pages in print) are disclosed in
                    advance (if applicable).
                  </p>
                </div>
              )}
            </section>

            {/* Indexing */}
            <section
              id="indexing"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "indexing"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("indexing")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Indexing & Persistent Identifiers
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "indexing" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "indexing" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Articles are assigned <strong>Crossref DOIs</strong> and are
                    structured for indexing by <strong>Google Scholar</strong>.
                    The journal will apply to the{" "}
                    <strong>Directory of Open Access Journals (DOAJ)</strong>{" "}
                    once eligibility thresholds are met.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-journal-rose border border-indigo-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Currently Indexed
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-journal-maroon rounded-full"></div>
                          Google Scholar
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-journal-maroon rounded-full"></div>
                          Crossref
                        </li>
                      </ul>
                    </div>
                    <div className="bg-journal-rose border border-indigo-200 rounded-lg p-4">
                      <h3 className="font-bold text-journal-maroon mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Application Pending
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-journal-maroon rounded-full"></div>
                          DOAJ
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-journal-maroon rounded-full"></div>
                          African Journals Online (AJOL)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Archiving */}
            <section
              id="archiving"
              className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                expandedSection === "archiving"
                  ? "border-journal-maroon"
                  : "border-journal-mauve"
              }`}
            >
              <button
                onClick={() => toggleSection("archiving")}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-journal-rose rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-journal-maroon" />
                  </div>
                  <h2 className="text-2xl font-bold text-journal-text-dark">
                    Archiving & Preservation
                  </h2>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 transition-transform ${
                    expandedSection === "archiving" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "archiving" && (
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All content is preserved via the{" "}
                    <strong>PKP Preservation Network (PN)</strong> and/or
                    LOCKSS/CLOCKSS to ensure long-term accessibility.
                  </p>
                  <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg">
                    <h3 className="font-bold text-gray-900 mb-2">
                      What This Means
                    </h3>
                    <p className="text-sm text-gray-700">
                      Even if this website becomes unavailable, your published
                      work will remain accessible through multiple independent
                      preservation networks. This ensures permanent scholarly
                      record.
                    </p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Distributed preservation across multiple locations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Regular integrity checks and backups
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Compliance with archival best practices
                    </li>
                  </ul>
                </div>
              )}
            </section>

            {/* Additional Information */}
            <div className="bg-journal-maroon text-white rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Questions About Our Policies?</h2>
              <p className="text-journal-rose mb-6 leading-relaxed">
                If you have questions about any of our editorial policies or need
                clarification, please don&apos;t hesitate to contact our editorial office.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:ubjh@uniben.edu"
                  className="inline-flex items-center justify-center gap-2 bg-white text-journal-maroon px-6 py-3 rounded-lg font-bold hover:bg-journal-rose transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  Contact Editorial Office
                </a>
                <Link
                  href="/for-authors"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-journal-maroon transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  Author Guidelines
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