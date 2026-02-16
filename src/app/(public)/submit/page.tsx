"use client";

import { useState, useRef, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Upload,
  AlertCircle,
  CheckCircle,
  Send,
  Loader2,
  X,
  Plus,
  Info,
  FileText,
  Users,
  ExternalLink,
} from 'lucide-react';
import { manuscriptApi } from '@/services/api';
import Footer from '@/components/Footer';
import { toast, Toaster } from 'sonner';

interface CoAuthor {
  id: string;
  name: string;
  email: string;
  faculty: string;
  affiliation: string;
  orcid: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ManuscriptSubmissionPage() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    submitterName: '',
    submitterEmail: '',
    submitterFaculty: '',
    submitterAffiliation: '',
    submitterOrcid: '',
  });

  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [showCoAuthorForm, setShowCoAuthorForm] = useState(false);
  const [currentCoAuthor, setCurrentCoAuthor] = useState({
    name: '',
    email: '',
    faculty: '',
    affiliation: '',
    orcid: '',
  });

  // File state
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Agreement state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle co-author input changes
  const handleCoAuthorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentCoAuthor(prev => ({ ...prev, [name]: value }));
  };

  // Add co-author
  const addCoAuthor = () => {
    if (
      !currentCoAuthor.name
    ) {
      toast.error('Please fill in the name for the co-author');
      return;
    }

    const newCoAuthor: CoAuthor = {
      id: Date.now().toString(),
      ...currentCoAuthor,
    };

    setCoAuthors(prev => [...prev, newCoAuthor]);
    setCurrentCoAuthor({
      name: '',
      email: '',
      faculty: '',
      affiliation: '',
      orcid: '',
    });
    setShowCoAuthorForm(false);
  };

  // Remove co-author
  const removeCoAuthor = (id: string) => {
    setCoAuthors(prev => prev.filter(author => author.id !== id));
  };

  // File validation
  const validateFile = (file: File): boolean => {
    setSubmitError('');

    // Check file type
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setSubmitError('Only DOCX files are accepted');
      return false;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('File size should not exceed 10MB');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setManuscriptFile(file);
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setManuscriptFile(file);
    }
  };

  // Validate ORCID format
  const validateOrcid = (orcid: string): boolean => {
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/;
    return orcidRegex.test(orcid);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    }

    if (!formData.abstract.trim()) {
      errors.abstract = 'Abstract is required';
    } else if (formData.abstract.length < 100) {
      errors.abstract = 'Abstract must be at least 100 characters';
    }

    if (!formData.keywords.trim()) {
      errors.keywords = 'At least one keyword is required';
    }

    if (!formData.submitterName.trim()) {
      errors.submitterName = 'Your name is required';
    }

    if (!formData.submitterEmail.trim()) {
      errors.submitterEmail = 'Your email is required';
    }

    if (!formData.submitterFaculty.trim()) {
      errors.submitterFaculty = 'Faculty/Department is required';
    }

    if (!formData.submitterAffiliation.trim()) {
      errors.submitterAffiliation = 'Affiliation is required';
    }

    if (!formData.submitterOrcid.trim()) {
      errors.submitterOrcid = 'ORCID iD is required';
    } else if (!validateOrcid(formData.submitterOrcid)) {
      errors.submitterOrcid = 'Please enter a valid ORCID iD (format: 0000-0000-0000-0000)';
    }

    if (!manuscriptFile) {
      errors.manuscriptFile = 'Please upload your manuscript DOCX';
    }

    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create FormData for API submission
      const apiFormData = new FormData();

      // Parse keywords
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      // Create submission data
      const submissionData = {
        title: formData.title,
        abstract: formData.abstract,
        keywords: keywordsArray,
        submitter: {
          name: formData.submitterName,
          email: formData.submitterEmail,
          faculty: formData.submitterFaculty,
          affiliation: formData.submitterAffiliation,
          orcid: formData.submitterOrcid,
        },
        coAuthors: coAuthors.map(author => ({
          email: author.email,
          name: author.name,
          faculty: author.faculty,
          affiliation: author.affiliation,
          orcid: author.orcid,
        })),
      };

      // Append JSON data
      Object.entries(submissionData).forEach(([key, value]) => {
        apiFormData.append(key, JSON.stringify(value));
      });

      // Append manuscript file
      if (manuscriptFile) {
        apiFormData.append('manuscriptFile', manuscriptFile);
      }

      // Submit to API
      const response = await manuscriptApi.submitManuscript(apiFormData);

      if (response.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(response.message || 'Submission failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Submission error:', error);
      setSubmitError(
        ((error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'Failed to submit manuscript. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      abstract: '',
      keywords: '',
      submitterName: '',
      submitterEmail: '',
      submitterFaculty: '',
      submitterAffiliation: '',
      submitterOrcid: '',
    });
    setCoAuthors([]);
    setManuscriptFile(null);
    setAgreedToTerms(false);
    setIsSubmitted(false);
    setSubmitError('');
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Success page
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-journal-maroon text-white shadow-lg">
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
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Submission Successful!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your manuscript has been submitted successfully and is now under review.
              </p>
              <div className="bg-blue-50 border-1 border-journal-maroon rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-journal-maroon mb-2">What happens next?</h3>
                <ul className="text-sm text-journal-maroon space-y-2 text-left">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Your login credentials will be sent within 24 hours</li>
                  <li>• You can track your submission status from your author dashboard</li>
                  <li>• Initial review typically takes 7-10 days</li>
                </ul>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 bg-journal-maroon text-white px-8 py-3 rounded-full font-semibold hover:bg-journal-maroon-dark transition-all"
              >
                Submit Another Manuscript
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Submit Your Manuscript
                </p>
              </div>
            </div>
            <Link
              href="/submission"
              className="text-white hover:text-journal-rose font-semibold"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Important Notice */}
        <div className="bg-blue-50 border-1 border-journal-maroon rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-journal-maroon flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-journal-maroon mb-2">
                No Account Required
              </h3>
              <p className="text-sm text-journal-maroon">
                You don&apos;t need to create an account to submit your manuscript. Simply fill out the form below, and an account will be automatically created for you. You&apos;ll receive your login credentials via email within 24 hours to 7 days to access your author dashboard and track your submission.
              </p>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Manuscript Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-journal-maroon text-white px-6 py-4 flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Manuscript Details</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your manuscript title"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract * (150-300 words)
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                    formErrors.abstract ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your abstract (minimum 100 characters)"
                />
                <div className="flex justify-between mt-1">
                  <div>
                    {formErrors.abstract && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.abstract}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formData.abstract.length} characters
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords * (4-8 keywords, separated by commas)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                    formErrors.keywords ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., postcolonial literature, African philosophy, cultural studies"
                />
                {formErrors.keywords && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.keywords}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Author Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-journal-maroon text-white px-6 py-4 flex items-center gap-3">
              <Users className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Primary Author (You)</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="submitterName"
                    value={formData.submitterName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                      formErrors.submitterName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {formErrors.submitterName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.submitterName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                      formErrors.submitterEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="youremail@institution.edu or youremail@gmail.com"
                  />
                  {formErrors.submitterEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.submitterEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty/Department *
                  </label>
                  <input
                    type="text"
                    name="submitterFaculty"
                    value={formData.submitterFaculty}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                      formErrors.submitterFaculty ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Faculty of Arts, Department of English and Literature"
                  />
                  {formErrors.submitterFaculty && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.submitterFaculty}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliation *
                  </label>
                  <input
                    type="text"
                    name="submitterAffiliation"
                    value={formData.submitterAffiliation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                      formErrors.submitterAffiliation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="University of Benin, Nigeria"
                  />
                  {formErrors.submitterAffiliation && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.submitterAffiliation}
                    </p>
                  )}
                </div>
              </div>

              {/* ORCID with help text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ORCID iD * (Required)
                </label>
                <input
                  type="text"
                  name="submitterOrcid"
                  value={formData.submitterOrcid}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent ${
                    formErrors.submitterOrcid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0000-0000-0000-0000"
                />
                {formErrors.submitterOrcid && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.submitterOrcid}
                  </p>
                )}
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 mb-2">
                    <strong>Don&apos;t have an ORCID iD?</strong> It&apos;s free and takes 2 minutes to register:
                  </p>
                  <ol className="text-sm text-amber-700 space-y-1 ml-4 list-decimal">
                    <li>Visit <a href="https://orcid.org/register" target="_blank" rel="noopener noreferrer" className="text-journal-maroon underline font-medium">https://orcid.org/register</a></li>
                    <li>Fill in your basic information (name, email, password)</li>
                    <li>Set your visibility preferences</li>
                    <li>Copy your 16-digit ORCID iD (format: 0000-0000-0000-0000)</li>
                    <li>Paste it in the field above</li>
                  </ol>
                  <a
                    href="https://orcid.org/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-journal-maroon hover:text-journal-maroon-dark font-semibold"
                  >
                    Register for ORCID iD
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Co-Authors Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-journal-maroon text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Co-Authors (Optional)</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCoAuthorForm(!showCoAuthorForm)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Co-Author
              </button>
            </div>

            <div className="p-6">
              {/* Co-Author List */}
              {coAuthors.length > 0 && (
                <div className="space-y-3 mb-6">
                  {coAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{author.name}</h4>
                        <p className="text-sm text-gray-600">{author.email}</p>
                        <p className="text-sm text-gray-600">
                          {author.affiliation}
                          {author.faculty && ` • ${author.faculty}`}
                        </p>
                        {author.orcid && (
                          <p className="text-sm text-gray-500">ORCID: {author.orcid}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCoAuthor(author.id)}
                        className="ml-4 text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Co-Author Form */}
              {showCoAuthorForm && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Add Co-Author</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentCoAuthor.name}
                        onChange={handleCoAuthorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                        placeholder="Co-author's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentCoAuthor.email}
                        onChange={handleCoAuthorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                        placeholder="email@institution.edu or email@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty/Department
                      </label>
                      <input
                        type="text"
                        name="faculty"
                        value={currentCoAuthor.faculty}
                        onChange={handleCoAuthorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                        placeholder="e.g., Faculty of Arts, Department of English and Literature"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affiliation
                      </label>
                      <input
                        type="text"
                        name="affiliation"
                        value={currentCoAuthor.affiliation}
                        onChange={handleCoAuthorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                        placeholder="Institution name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ORCID iD
                      </label>
                      <input
                        type="text"
                        name="orcid"
                        value={currentCoAuthor.orcid}
                        onChange={handleCoAuthorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                        placeholder="0000-0000-0000-0000"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={addCoAuthor}
                      className="flex-1 bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-colors font-medium"
                    >
                      Add Co-Author
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCoAuthorForm(false);
                        setCurrentCoAuthor({
                          name: '',
                          email: '',
                          faculty: '',
                          affiliation: '',
                          orcid: '',
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {coAuthors.length === 0 && !showCoAuthorForm && (
                <p className="text-center text-gray-500 py-8">
                  No co-authors added yet. Click &quot;Add Co-Author&quot; to include collaborators.
                </p>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-journal-maroon text-white px-6 py-4 flex items-center gap-3">
              <Upload className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Manuscript Upload</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Please upload your complete manuscript in DOCX format. Ensure it follows the{' '}
                <Link href="/for-authors" className="text-journal-maroon underline hover:text-journal-maroon-dark">
                  author guidelines
                </Link>.
              </p>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-journal-maroon bg-journal-rose'
                    : manuscriptFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-journal-maroon'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="manuscript-upload"
                />

                {manuscriptFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="font-semibold text-gray-900">{manuscriptFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(manuscriptFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setManuscriptFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <label
                        htmlFor="manuscript-upload"
                        className="cursor-pointer text-journal-maroon hover:text-journal-maroon-dark font-semibold"
                      >
                        Click to upload
                      </label>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                    <p className="text-sm text-gray-500">DOCX only, up to 10MB</p>
                  </div>
                )}
              </div>

              {formErrors.manuscriptFile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {formErrors.manuscriptFile}
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 text-journal-maroon rounded focus:ring-journal-maroon"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that this manuscript is original work, has not been published elsewhere,
                    and is not under consideration by another journal. I agree to the{' '}
                    <Link href="/policies" className="text-journal-maroon underline hover:text-journal-maroon-dark">
                      journal policies
                    </Link>{' '}
                    and{' '}
                    <Link href="/for-authors" className="text-journal-maroon underline hover:text-journal-maroon-dark">
                      submission guidelines
                    </Link>
                    . I understand that my manuscript will undergo double-anonymous peer review.
                  </span>
                </label>
                {formErrors.terms && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.terms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-journal-maroon hover:bg-journal-maroon-dark text-white hover:shadow-2xl'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  Submit Manuscript
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer/>
      <Toaster position="top-center" richColors />
    </div>
  );
}
