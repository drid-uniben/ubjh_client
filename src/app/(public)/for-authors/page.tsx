"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  Download,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Mail,
  BookOpen,
  Shield,
  Award,
  Globe,
} from "lucide-react";
import Header from "@/components/Header"
import Footer from "@/components/Footer";
import Image from "next/image"

export default function ForAuthorsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of manuscripts do you accept?",
      answer:
        "We accept original research articles, review articles, short communications, book reviews, and policy briefs in the humanities disciplines including law & society, history, languages, culture, philosophy, arts, and environmental humanities.",
    },
    {
      question: "How long does the peer review process take?",
      answer:
        "Our typical timeline is 3-6 weeks to first decision. We assign reviewers within 21 days, and aim for a first decision within 30-45 days of submission. Authors typically have 14 days to submit revisions.",
    },
    {
      question: "Are there any article processing charges (APCs)?",
      answer:
        "No. This is a Diamond Open Access journal — completely free for both authors and readers. There are no submission fees, publication fees, or hidden charges.",
    },
    {
      question: "What file formats should I use for submission?",
      answer:
        "We only accept DOCX for the main manuscript. Supplementary files can be in various formats (CSV, XLSX for data; PNG, JPG for images). Please ensure all files are clearly labeled.",
    },
    {
      question: "Do I need an ORCID iD?",
      answer:
        "Yes it is mandatory, we require that all authors have an ORCID iD. It helps distinguish you from other researchers with similar names and makes your work more discoverable. You can register for free at orcid.org.",
    },
    {
      question: "What citation style should I use?",
      answer:
        "We accept multiple citation styles (APA, Chicago, MLA, Harvard). Please be consistent throughout your manuscript. Detailed formatting guidelines are available in our Author Guidelines document.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
     <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white py-16">
         <div className="absolute inset-0 opacity-10">
                          {/* Placeholder for subtle pattern/texture */}
                          <Image
                            src="/academic-pattern.png"
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Author Resources & Guidelines
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Publish Your Research With Us
            </h1>
            <p className="text-xl mb-8 text-journal-rose leading-relaxed">
              Join a community of scholars advancing knowledge in the
              humanities. No fees. Fast review. Global reach.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-journal-off-white border-b-2 border-journal-mauve">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-journal-maroon mb-2">
                0 NGN
              </div>
              <p className="text-gray-600">Article Processing Charges</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-journal-maroon mb-2">
                3-6
              </div>
              <p className="text-gray-600">Weeks to First Decision</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-journal-maroon mb-2">
                100%
              </div>
              <p className="text-gray-600">Open Access</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-journal-maroon mb-2">
                CC BY 4.0
              </div>
              <p className="text-gray-600">Creative Commons License</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Submission Guidelines */}
            <section id="guidelines">
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                Submission Guidelines
              </h2>

              <div className="space-y-6">
                <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                  <h3 className="text-xl font-bold text-journal-text-dark mb-4 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-journal-maroon" />
                    Types of Manuscripts We Accept
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-journal-text-dark">
                          Original Research Articles
                        </strong>
                        <p className="text-gray-600 text-sm">
                          Full-length empirical, theoretical, or doctrinal
                          research (5,000-10,000 words)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-journal-text-dark">
                          Review Articles
                        </strong>
                        <p className="text-gray-600 text-sm">
                          Comprehensive literature reviews and systematic
                          reviews (6,000-12,000 words)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-journal-text-dark">
                          Short Communications
                        </strong>
                        <p className="text-gray-600 text-sm">
                          Brief reports of preliminary findings or emerging
                          debates (2,000-3,000 words)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-journal-text-dark">Book Reviews</strong>
                        <p className="text-gray-600 text-sm">
                          Critical assessments of recent publications (1,500-2,500
                          words)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-journal-text-dark">
                          Policy Briefs
                        </strong>
                        <p className="text-gray-600 text-sm">
                          Research-informed recommendations for policy and
                          practice (2,000-4,000 words)
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                  <h3 className="text-xl font-bold text-journal-text-dark mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-journal-maroon" />
                    Manuscript Formatting Requirements
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-journal-text-dark mb-2">
                        Document Format
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Only DOCX format is accepted</li>
                        <li>
                          A4 paper size with 2.5cm (1 inch) margins on all sides
                        </li>
                        <li>
                          Double-spaced throughout (including references)
                        </li>
                        <li>12-point font (Times New Roman or similar)</li>
                        <li>
                          Line numbers for ease of reviewer comments (recommended)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-journal-text-dark mb-2">
                        Structure
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>
                          <strong>Title Page:</strong> Title, author names,
                          affiliations, corresponding author email, ORCID iDs
                        </li>
                        <li>
                          <strong>Abstract:</strong> 150-300 words (not required
                          for book reviews)
                        </li>
                        <li>
                          <strong>Keywords:</strong> 5-7 keywords for indexing
                        </li>
                        <li>
                          <strong>Main Text:</strong> Introduction, main body
                          (methodology, results, discussion as appropriate),
                          conclusion
                        </li>
                        <li>
                          <strong>References:</strong> Formatted consistently
                          (APA, Chicago, MLA, or Harvard)
                        </li>
                        <li>
                          <strong>Declarations:</strong> Funding, conflicts of
                          interest, ethics approval, data availability
                        </li>
                      </ul>
                    </div>

                    <div className="bg-journal-rose border border-[#E6B6C2] rounded-lg p-4">
  <div className="flex items-start gap-3">
    <Download className="h-5 w-5 text-journal-maroon flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-journal-maroon mb-2">
        Download Manuscript Template
      </h4>
      <p className="text-gray-700 text-sm mb-3">
        Use our official template to ensure your manuscript
        meets all formatting requirements.
      </p>
      <a
        href="/files/UNIBEN_Journal_Of_Humanities_Templates.docx"
        download
        className="inline-flex items-center gap-2 bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-colors text-sm font-semibold"
      >
        <Download className="h-4 w-4" />
        Download Template (DOCX)
      </a>
    </div>
  </div>
</div>

                  </div>
                </div>
              </div>
            </section>

            {/* Submission Process */}
            <section id="process">
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                The Submission Process
              </h2>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-journal-mauve"></div>

                <div className="space-y-8">
          

                  {/* Step 2 */}
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      1
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                        Prepare Your Manuscript
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Ensure your manuscript follows our formatting guidelines
                        and includes all required sections: abstract, keywords,
                        main text, references, and declarations.
                      </p>
                      <div className="flex gap-3">
                        <span className="px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-semibold">
                          Use our template
                        </span>
                        <span className="px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-semibold">
                          Include ORCID iDs
                        </span>
                        <span className="px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-semibold">
                          Double-check references
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      2
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                        Submit Online
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Upload your manuscript and supplementary files through
                        our online submission system. Fill in metadata fields
                        and provide author information.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                        <strong className="text-blue-900">
                          Estimated time:
                        </strong>{" "}
                        15-20 minutes
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      3
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                        Editorial Assessment
                      </h3>
                      <p className="text-gray-700 mb-3">
                        The Editor-in-Chief conducts an initial assessment for
                        scope, quality, and suitability. Manuscripts that pass
                        this stage are sent for peer review.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          <strong>Timeline:</strong> Within 7-10 days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      4
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                        Peer Review
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Your manuscript undergoes double-anonymous peer review by
                        at least two independent experts in your field.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          <strong>Timeline:</strong> 3-6 weeks to first decision
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      5
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                        Decision & Publication
                      </h3>
                      <p className="text-gray-700 mb-3">
                        You&apos;ll receive a decision (accept, minor/major revisions,
                        or reject). Accepted articles are published online
                        immediately and assigned a DOI.
                      </p>
                      <div className="flex gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Continuous publication
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Crossref DOI assigned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Article Processing Charges */}
            <section id="apcs" className="to-emerald-50 border-2 border-green-200 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-3">
                    No Article Processing Charges (APCs)
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    This is a <strong>Diamond Open Access</strong> journal,
                    meaning it&apos;s completely free for both authors and readers.
                    There are no submission fees, publication fees, color charges,
                    or any hidden costs.
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Supported by:</strong> TETFund and the University of
                    Benin
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    We believe knowledge should be freely accessible to all,
                    without financial barriers to publication or access.
                  </p>
                </div>
              </div>
            </section>

            {/* Copyright & Licensing */}
            <section id="copyright">
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                Copyright & Licensing
              </h2>

              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-journal-maroon flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-journal-text-dark mb-3">
                      Authors Retain Copyright
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      All articles are published under the{" "}
                      <strong>Creative Commons Attribution 4.0 International
                      License (CC BY 4.0)</strong>. This means:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <strong>You keep copyright</strong> of your work
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Readers can freely access, download, and share your article
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          Others can build upon your work with proper attribution
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          You can post preprints and accepted manuscripts in
                          repositories
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-journal-off-white rounded-lg p-4">
                  <h4 className="font-semibold text-journal-text-dark mb-2">
                    Self-Archiving Policy
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Authors may archive preprints and the Author Accepted
                    Manuscript (AAM) in institutional or subject repositories.
                    Please link to the final published version using the DOI.
                  </p>
                </div>

                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-journal-maroon hover:text-journal-maroon-dark font-semibold"
                >
                  Learn more about CC BY 4.0
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Data Availability */}
            <section id="data-availability">
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                Data & Materials Sharing
              </h2>

              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Globe className="h-8 w-8 text-journal-maroon flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-journal-text-dark mb-3">
                      Data Availability Statement Required
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      All submissions must include a <strong>Data Availability
                      Statement</strong> describing whether and how the
                      underlying data can be accessed. This promotes transparency
                      and reproducibility in research.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recommended Practice
                    </h4>
                    <p className="text-sm text-gray-700">
                      Share datasets, code, and supplementary materials in trusted
                      repositories (e.g., Zenodo, Figshare, GitHub) with
                      persistent identifiers.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Ethical/Legal Restrictions
                    </h4>
                    <p className="text-sm text-gray-700">
                      If data cannot be shared due to ethical or legal
                      constraints, clearly state the conditions and how access
                      may be requested.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faqs">
              <h2 className="text-3xl font-bold text-journal-maroon mb-6 font-serif">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-journal-mauve rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
                    >
                      <h3 className="text-lg font-bold text-journal-text-dark pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`h-6 w-6 text-journal-maroon flex-shrink-0 transition-transform ${
                          openFAQ === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-journal-maroon text-white rounded-xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Need Help? Contact the Editorial Office
                  </h2>
                  <p className="text-journal-rose mb-6 leading-relaxed">
                    Our editorial team is here to assist you with any questions
                    about the submission process, manuscript preparation, or
                    journal policies.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <a
                        href="mailto:ubjh@uniben.edu"
                        className="hover:text-journal-rose transition-colors"
                      >
                        ubjh@uniben.edu
                      </a>
                    </div>
                    <div className="text-sm text-journal-rose">
                      <strong>Response time:</strong> Within 48 hours (business
                      days)
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Start CTA */}
              <div className="bg-gradient-to-br from-journal-maroon to-journal-maroon-dark text-white rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Ready to Submit?</h3>
                <p className="text-journal-rose font-semibold text-sm mb-6">
                  Start your submission now through our online platform
                </p>
                <Link
                  href="/submission"
                  className="block w-full bg-white text-journal-maroon text-center px-6 py-3 rounded-lg font-bold hover:bg-journal-rose transition-all shadow-lg"
                >
                  Submit Manuscript
                </Link>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs font-semibold text-journal-rose">
                    No registration required. Submit to get started.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <h3 className="text-lg font-bold text-journal-maroon mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#guidelines"
                      className="flex items-center gap-2 text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Submission Guidelines
                    </a>
                  </li>
                  <li>
                    <a
                      href="#process"
                      className="flex items-center gap-2 text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Submission Process
                    </a>
                  </li>
                  <li>
                    <a
                      href="#apcs"
                      className="flex items-center gap-2 text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      APCs & Fees
                    </a>
                  </li>
                  <li>
                    <a
                      href="#copyright"
                      className="flex items-center gap-2 text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Copyright & Licensing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faqs"
                      className="flex items-center gap-2 text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Downloads */}
              <div className="bg-journal-off-white border-2 border-journal-mauve rounded-xl p-6">
                <h3 className="text-lg font-bold text-journal-maroon mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/files/UBJH_Manuscript_Template.docx"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Manuscript Template (DOCX)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/files/UBJH_Author_Guidelines.pdf"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Full Author Guidelines (PDF)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/files/UBJH_Citation_Style_Guide.pdf"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Citation Style Guide (PDF)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/files/UBJH_Ethics_Checklist.pdf"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-journal-maroon transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Ethics Checklist (PDF)
                    </a>
                  </li>
                </ul>
              </div>

              {/* Service Levels */}
              <div className="bg-white border-2 border-journal-mauve rounded-xl p-6">
                <h3 className="text-lg font-bold text-journal-maroon mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Service Levels
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Reviewer assignment</span>
                    <span className="font-semibold text-journal-maroon">
                      21 days
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">First decision</span>
                    <span className="font-semibold text-journal-maroon">
                      30-45 days
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Author revisions</span>
                    <span className="font-semibold text-journal-maroon">
                      ≤14 days
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Publication</span>
                    <span className="font-semibold text-journal-maroon">
                      Continuous
                    </span>
                  </li>
                </ul>
              </div>

              {/* Trust Badge */}
              <div className="border-2 border-journal-mauve rounded-xl p-6 text-center">
                <Award className="h-12 w-12 text-journal-maroon mx-auto mb-3" />
                <h3 className="font-bold text-journal-maroon mb-2">
                  Diamond Open Access
                </h3>
                <p className="text-sm text-gray-700">
                  No fees for authors or readers. Funded by TETFund & UNIBEN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Simplified */}
      <Footer/>
         </div>
  );
}