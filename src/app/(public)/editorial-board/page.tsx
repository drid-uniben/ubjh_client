"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Users } from "lucide-react";
import Footer from "@/components/Footer";

interface EditorProfile {
  name: string;
  role: string;
  affiliation: string;
  department?: string;
  bio?: string;
  photo: string;
  orcid?: string;
  email?: string;
  specialization?: string[];
}

export default function EditorialBoardPage() {
  const editorInChief = {
    name: "Professor Edoba B. Omoregie, SAN.",
    role: "Editor-in-Chief",
    affiliation: "Vice Chancellor for UNIBEN",
    photo: "/editor-chiefff.png",
  };

  const managingEditor = {
    name: "Prof. Ngozi Finette Unuigbe",
    role: "Managing Editor",
    affiliation:
      "Director, Directorate of Research, Innovation and Development (DRID)",
    photo: "/managing-editorrr.png",
  };

  const associateEditors: EditorProfile[] = [
    {
      name: "Professor Jane Igie Aba",
      role: "Associate Editor",
      affiliation: "University Librarian",
      photo: "/librarian.png",
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
                  Editorial Board
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
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Leadership & Expertise
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight font-serif">
              Editorial Board
            </h1>
            <p className="text-xl text-journal-rose leading-relaxed">
              Distinguished scholars committed to advancing excellence in
              humanities research
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editor-in-Chief */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-journal-maroon mb-8 font-serif flex items-center gap-3">
              <Award className="h-8 w-8" />
              Editor-in-Chief
            </h2>
            <div className="bg-white border-4 border-journal-maroon rounded-2xl p-8 shadow-xl max-w-sm mx-auto">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <Image
                    src={editorInChief.photo}
                    alt={editorInChief.name}
                    fill
                    className="rounded-full object-cover border-4 border-journal-maroon"
                  />
                </div>
                <h3 className="text-2xl font-bold text-journal-text-dark mb-2">
                  {editorInChief.name}
                </h3>
                <p className="text-journal-maroon font-semibold mb-2">
                  {editorInChief.role}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {editorInChief.affiliation}
                </p>
              </div>
            </div>
          </div>

          {/* Managing Editor */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-journal-maroon mb-8 font-serif">
              Managing Editor
            </h2>
            <div className="bg-white border-2 border-journal-mauve rounded-xl p-6 hover:shadow-xl transition-all max-w-sm mx-auto">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <Image
                    src={managingEditor.photo}
                    alt={managingEditor.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-journal-text-dark mb-1">
                  {managingEditor.name}
                </h3>
                <p className="text-sm text-journal-maroon font-semibold mb-2">
                  {managingEditor.role}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {managingEditor.affiliation}
                </p>
              </div>
            </div>
          </div>

          {/* Associate Editors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-journal-maroon mb-8 font-serif">
              Associate Editors
            </h2>
            <div className="flex justify-center">
              {associateEditors.map((editor, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-journal-mauve rounded-xl p-6 w-full max-w-sm"
                >
                  <div className="text-center mb-4">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <Image
                        src={editor.photo}
                        alt={editor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-journal-text-dark mb-1">
                      {editor.name}
                    </h3>
                    <p className="text-sm text-journal-maroon font-semibold mb-2">
                      {editor.role}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {editor.affiliation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}