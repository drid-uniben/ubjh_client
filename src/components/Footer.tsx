"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const indexingPlatforms = [
    {
      name: "Google Scholar",
      logo: "/indexing/google-scholar.jpg",
      url: "https://scholar.google.com",
      status: "active",
    },
    {
      name: "Crossref",
      logo: "/indexing/crossref.png",
      url: "https://www.crossref.org",
      status: "active",
    },
    {
      name: "COPE",
      logo: "/indexing/cope.png",
      url: "https://publicationethics.org",
      status: "active",
    },
    {
      name: "BASE",
      logo: "/indexing/base.png",
      url: "https://www.base-search.net",
      status: "active",
    },
    {
      name: "PKP PN",
      logo: "/indexing/pkp.png",
      url: "https://pkp.sfu.ca/pkp-pn",
      status: "active",
    },
    {
      name: "Internet Archive",
      logo: "/indexing/ia.png",
      url: "https://archive.org",
      status: "active",
    },
    {
      name: "DOAJ",
      logo: "/indexing/doaj.png",
      url: "https://doaj.org",
      status: "pending",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-journal-off-white to-white border-t-2 border-journal-mauve">
      {/* Indexing & Trust Indicators */}
      <section className="py-12 border-b border-journal-mauve">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-journal-maroon mb-2 tracking-wide">
            INDEXED & PRESERVED BY
          </h3>
          <p className="text-center text-xs text-gray-600 mb-8">
            Ensuring long-term accessibility and discoverability
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {indexingPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="bg-white border-2 border-journal-mauve rounded-xl p-4 h-24 flex items-center justify-center transition-all group-hover:border-journal-maroon group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="relative w-full h-full">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {platform.status === "pending" && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-center text-xs font-medium text-gray-700 mt-2 group-hover:text-journal-maroon transition-colors">
                  {platform.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ISSN & Open Access Badges */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="flex items-center gap-2 bg-white border-2 border-journal-mauve rounded-lg px-6 py-3">
                <div className="text-journal-maroon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-600">Print ISSN</div>
                  <div className="text-sm font-bold text-journal-maroon">2734-3278</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-white border-2 border-journal-mauve rounded-lg px-6 py-3">
                <div className="text-journal-maroon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-600">e-ISSN (Online)</div>
                  <div className="text-sm font-bold text-journal-maroon">3121-763X</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg px-6 py-3">
                <div className="text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-600">Open Access</div>
                  <div className="text-sm font-bold text-green-700">Diamond OA</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-white border-2 border-journal-mauve rounded-lg px-6 py-3">
                <div className="relative w-18 h-18">
                  <Image
                    src="/indexing/open_access.png"
                    alt="Open Access Image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-lg px-6 py-3">
                <div className="text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-600">License</div>
                  <div className="text-sm font-bold text-blue-700">CC BY 4.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-journal-maroon mb-4 text-sm tracking-wide">
                QUICK LINKS
              </h3>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/current-issue", label: "Current Issue" },
                  { href: "/archives", label: "Archives" },
                  { href: "/for-authors", label: "For Authors" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-journal-maroon transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-journal-maroon transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-journal-maroon mb-4 text-sm tracking-wide">
                ABOUT
              </h3>
              <ul className="space-y-2">
                {[
                  { href: "/about", label: "Journal Overview" },
                  { href: "/editorial-board", label: "Editorial Board" },
                  { href: "/policies", label: "Policies" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-journal-maroon transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-journal-maroon transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-journal-maroon mb-4 text-sm tracking-wide">
                RESOURCES
              </h3>
              <ul className="space-y-2">
                {[
                  { href: "/for-authors", label: "Author Guidelines" },
                  { href: "/about#peer-review", label: "Peer Review" },
                  { href: "/policies#ethics", label: "Publication Ethics" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-journal-maroon transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-journal-maroon transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-journal-maroon mb-4 text-sm tracking-wide">
                CONTACT
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-journal-maroon mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:ubjh@uniben.edu"
                    className="hover:text-journal-maroon transition-colors"
                  >
                    ubjh@uniben.edu
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-journal-maroon mt-0.5 flex-shrink-0" />
                  <span>
                    University of Benin<br />
                    Ugbowo Campus, PMB 1154<br />
                    Benin City, Edo State, Nigeria
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-journal-mauve pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} University of Benin — UNIBEN Journal of Humanities
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}