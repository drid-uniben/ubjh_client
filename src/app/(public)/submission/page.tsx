"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  CheckCircle,
  Users,
  Upload,
  Send,
  ArrowRight,
  Clock,
  Shield,
  Globe,
  HelpCircle,
  Mail,
  BookOpen,
  AlertCircle,
  Download,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SubmissionPortalPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const submissionSteps = [
    {
      number: 1,
      title: "Prepare Your Manuscript",
      description:
        "Ensure your manuscript follows our formatting guidelines. Use our template and include all required sections: abstract, keywords, main text, and references.",
      icon: FileText,
      duration: "Before submission",
    },
    {
      number: 2,
      title: "Fill Submission Form",
      description:
        "Enter article metadata including title, authors, affiliations, abstract, and keywords. Provide ORCID iDs for all authors (required).",
      icon: Upload,
      duration: "5-10 minutes",
    },
    {
      number: 3,
      title: "Upload Manuscript Files",
      description:
        "Upload your main manuscript (DOCX) and any supplementary materials. Maximum file size: 10MB per file.",
      icon: Upload,
      duration: "2-5 minutes",
    },
    {
      number: 4,
      title: "Add Contributors",
      description:
        "List all co-authors with their contact information, affiliations, and ORCID iDs. Designate the corresponding author.",
      icon: Users,
      duration: "3-5 minutes",
    },
    {
      number: 5,
      title: "Submit & Track",
      description:
        "Review your submission, agree to terms, and submit. You'll receive immediate confirmation and can track progress through your dashboard.",
      icon: Send,
      duration: "1-2 minutes",
    },
  ];

  const requirements = [
    {
      title: "Original Research",
      description: "Must be original work not published elsewhere",
      met: true,
    },
    {
      title: "Submission Guidelines",
      description: "Follows journal formatting requirements",
      met: true,
    },
    {
      title: "File Format",
      description: "DOCX format",
      met: true,
    },
    {
      title: "Abstract",
      description: "150-300 words (not required for book reviews)",
      met: true,
    },
    {
      title: "ORCID iDs",
      description: "Required for all authors",
      met: false,
    },
    {
      title: "Data Availability",
      description: "Statement required for empirical research",
      met: true,
    },
  ];

  const faqs = [
    {
      question: "How long does the submission process take?",
      answer:
        "The online submission form takes approximately 15-20 minutes to complete. This includes entering metadata, uploading files, and adding co-author information.",
    },
    {
      question: "What file formats do you accept?",
      answer:
        "We only accept DOCX formats for the main manuscript. Supplementary files can be in various formats including CSV, XLSX, PNG, and JPG.",
    },
    {
      question: "Do I need an ORCID iD to submit?",
      answer:
        "It is mandatory, we strongly require that all authors have ORCID iDs. They help distinguish you from other researchers and make your work more discoverable.",
    },
    {
      question: "Can I track my submission status?",
      answer:
        "Yes! Once you submit, you'll receive a submission ID and can log into your author dashboard to track the peer review process and editorial decisions.",
    },
    {
      question: "What happens after I submit?",
      answer:
        "You'll receive an email confirmation immediately. The Editor-in-Chief will conduct an initial assessment (7-10 days), then your manuscript will be sent for peer review if suitable. Typical timeline to first decision is 3-6 weeks.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-journal-maroon to-[rgb(90,10,26)] text-white py-20">
        <div className="absolute inset-0 opacity-10">
                  {/* Placeholder for subtle pattern/texture */}
                  <Image
                    src="/academic-pattern.png"
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Send className="h-4 w-4" />
              <span className="text-sm font-semibold">Online Submission</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Submit Your Manuscript
            </h1>
            <p className="text-xl text-journal-rose mb-8 leading-relaxed">
              Join scholars advancing knowledge in the humanities. Fast review,
              no fees, global reach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 bg-white text-journal-maroon px-8 py-4 rounded-full font-bold hover:bg-journal-rose transition-all shadow-xl hover:shadow-2xl text-lg"
              >
                <Send className="h-6 w-6" />
                Start New Submission
              </Link>
              <Link
                href="/author/login"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-journal-maroon transition-all text-lg"
              >
                <Users className="h-6 w-6" />
                Login to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Publish With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-journal-maroon mb-4 font-serif">
              Why Publish With Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience a seamless submission process with transparent review
              and no hidden costs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-journal-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                No Fees
              </h3>
              <p className="text-gray-600">
                Diamond Open Access — completely free for authors and readers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-journal-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                Fast Review
              </h3>
              <p className="text-gray-600">
                3–6 weeks to first decision with rigorous double-anonymous peer
                review
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-journal-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600">
                Crossref DOIs, Google Scholar indexing, and international
                visibility
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-journal-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-journal-maroon" />
              </div>
              <h3 className="text-xl font-bold text-journal-text-dark mb-2">
                You Keep Rights
              </h3>
              <p className="text-gray-600">
                Authors retain copyright under CC BY 4.0 open access license
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Process */}
      <section className="py-16 bg-journal-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-journal-maroon mb-4 font-serif">
              Submission Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six simple steps from preparation to submission
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-12 bottom-12 w-1 bg-journal-mauve"></div>

            <div className="space-y-12">
              {submissionSteps.map((step, idx) => (
                <div
                  key={step.number}
                  className={`relative flex gap-8 items-start ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Step Content */}
                  <div
                    className={`flex-1 bg-white border-2 border-journal-mauve rounded-xl p-6 hover:shadow-xl transition-all ${
                      idx % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <step.icon className="h-6 w-6 text-journal-maroon" />
                      <h3 className="text-xl font-bold text-journal-text-dark">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-journal-rose border border-[#E6B6C2] text-journal-maroon-dark rounded-full text-xs font-semibold">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </div>
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-journal-maroon rounded-full flex items-center justify-center text-white font-bold text-2xl z-10 shadow-lg">
                    {step.number}
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              <strong>Total estimated time:</strong> 15-20 minutes
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-journal-maroon text-white px-8 py-4 rounded-full font-bold hover:bg-journal-maroon-dark transition-all shadow-xl text-lg"
            >
              Begin Submission Process
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Checklist */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-journal-maroon mb-4 font-serif">
                Submission Requirements
              </h2>
              <p className="text-gray-600">
                Ensure your manuscript meets these criteria before submission
              </p>
            </div>

            <div className="bg-journal-off-white border-2 border-journal-mauve rounded-xl p-8">
              <div className="space-y-4">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg"
                  >
                    {req.met ? (
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-journal-text-dark mb-1">
                        {req.title}
                      </h3>
                      <p className="text-sm text-gray-600">{req.description}</p>
                    </div>
                    {!req.met && (
                      <span className="text-xs text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full font-semibold">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t-2 border-journal-mauve">
                <h3 className="font-bold text-journal-text-dark mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-journal-maroon" />
                  Helpful Resources
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="/files/UNIBEN_Journal_Of_Humanities_Templates.docx"
                    className="flex items-center gap-3 p-4 bg-white border-2 border-journal-mauve rounded-lg hover:border-journal-maroon transition-colors"
                  >
                    <FileText className="h-5 w-5 text-journal-maroon" />
                    <div>
                      <div className="font-semibold text-journal-text-dark text-sm">
                        Manuscript Template
                      </div>
                      <div className="text-xs text-gray-600">DOCX format</div>
                    </div>
                  </a>
                  <a
                    href="/files/UBJH_Author_Guidelines.pdf"
                    className="flex items-center gap-3 p-4 bg-white border-2 border-journal-mauve rounded-lg hover:border-journal-maroon transition-colors"
                  >
                    <FileText className="h-5 w-5 text-journal-maroon" />
                    <div>
                      <div className="font-semibold text-journal-text-dark text-sm">
                        Author Guidelines
                      </div>
                      <div className="text-xs text-gray-600">PDF format</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-journal-off-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-journal-maroon mb-4 font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common submission questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-journal-mauve rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === idx ? null : idx)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-journal-off-white transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <HelpCircle className="h-5 w-5 text-journal-maroon flex-shrink-0 mt-0.5" />
                    <h3 className="font-bold text-journal-text-dark">{faq.question}</h3>
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === idx ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="/for-authors"
              className="inline-flex items-center gap-2 text-journal-maroon hover:text-journal-maroon-dark font-semibold"
            >
              View Full Author Guidelines
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical Support */}
            <div className="border-2 bg-journal-rose border-journal-mauve rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-journal-maroon rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-6 w-6 text-journal-mauve" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-journal-maroon mb-3">
                    Technical Support
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Having trouble with the submission system? Our technical
                    team can help with login issues, file uploads, and system
                    errors.
                  </p>
                  <a
                    href="mailto:drid@uniben.edu"
                    className="inline-flex items-center gap-2 text-journal-maroon hover:text-[#7a0018ea] font-semibold"
                  >
                    <Mail className="h-4 w-4" />
                    drid@uniben.edu
                  </a>
                </div>
              </div>
            </div>

            {/* Editorial Office */}
            <div className="border-4 bg-journal-maroon border-journal-mauve rounded-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-journal-mauve rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-journal-maroon" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-journal-mauve mb-3">
                    Editorial Office
                  </h3>
                  <p className="text-white mb-4">
                    Questions about manuscript preparation, journal scope, or
                    editorial policies? Contact our editorial team.
                  </p>
                  <a
                    href="mailto:ubjh@uniben.edu"
                    className="inline-flex items-center gap-2 text-journal-mauve hover:text-purple-900 font-semibold"
                  >
                    <Mail className="h-4 w-4" />
                    ubjh@uniben.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-journal-maroon to-journal-maroon-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Ready to Share Your Research?
          </h2>
          <p className="text-xl text-journal-rose mb-8 leading-relaxed">
            Join scholars from across Africa and beyond in advancing humanities
            knowledge through rigorous, open access scholarship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-white text-journal-maroon px-8 py-4 rounded-full font-bold hover:bg-journal-rose transition-all shadow-xl text-lg"
            >
              <Send className="h-6 w-6" />
              Start Your Submission
            </Link>
            <Link
              href="/for-authors"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-journal-maroon transition-all text-lg"
            >
              <FileText className="h-6 w-6" />
              Read Guidelines First
            </Link>
          </div>

          <div className="mt-12 pt-12 border-t border-white/20">
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="text-3xl text-white font-bold mb-2">0 NGN</div>
                <div className="text-sm text-journal-rose">
                  Article Processing Charges
                </div>
              </div>
              <div>
                <div className="text-3xl text-white font-bold mb-2">3-6 Weeks</div>
                <div className="text-sm text-journal-rose">
                  Average Review Time
                </div>
              </div>
              <div>
                <div className="text-3xl text-white font-bold mb-2">CC BY 4.0</div>
                <div className="text-sm text-journal-rose">
                  Open Access License
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

