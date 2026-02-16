"use client";

import { useState, useEffect } from "react";
import {
  publicationApi,
  volumeApi,
  issueApi,
  getAuthors,
  Volume,
  Issue,
  Author,
  getErrorMessage,
} from "@/services/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ARTICLE_TYPES = [
  { value: "research_article", label: "Research Article" },
  { value: "review_article", label: "Review Article" },
  { value: "case_study", label: "Case Study" },
  { value: "book_review", label: "Book Review" },
  { value: "editorial", label: "Editorial" },
  { value: "commentary", label: "Commentary" },
];

export default function ManualArticleUploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    authorId: "",
    coAuthorIds: [] as string[],
    volumeId: "",
    issueId: "",
    articleType: "research_article",
    pageStart: "",
    pageEnd: "",
    publishDate: new Date().toISOString().split("T")[0],
    customDOI: "",
  });

  const [publicationOptions, setPublicationOptions] = useState({
    doiEnabled: false,
    internetArchiveEnabled: false,
    emailNotificationEnabled: false,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchVolumesAndIssues();
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData.volumeId) {
      fetchIssuesForVolume(formData.volumeId);
    } else {
      setIssues([]);
    }
  }, [formData.volumeId]);

  const fetchVolumesAndIssues = async () => {
    try {
      setIsLoading(true);
      const volumesRes = await volumeApi.getVolumes();
      setVolumes(volumesRes.data);
      
      // Fetch authors (only active ones)
      const authorsRes = await getAuthors();
      const activeAuthors = authorsRes.data.filter((author) => author.isActive !== false);
      setAuthors(activeAuthors);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load volumes or authors");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssuesForVolume = async (volumeId: string) => {
    try {
      const response = await issueApi.getIssuesByVolume(volumeId);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to load issues");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
    } else {
      setPdfFile(null);
      setError("Only PDF files are accepted");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.title ||
      !formData.abstract ||
      !formData.authorId ||
      !formData.volumeId ||
      !formData.issueId ||
      !pdfFile
    ) {
      const msg = "Please fill in all required fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("abstract", formData.abstract);
      submitFormData.append("keywords", formData.keywords);
      submitFormData.append("authorId", formData.authorId);
      
      // Add co-authors (filter to only valid, active authors)
      const validAuthorIds = new Set(authors.map(a => a._id));
      const coAuthorsToSend = formData.coAuthorIds.filter(
        (id) => id !== formData.authorId && validAuthorIds.has(id)
      );
      
      console.log("=== DEBUG INFO ===");
      console.log("formData.coAuthorIds:", formData.coAuthorIds);
      console.log("validAuthorIds:", Array.from(validAuthorIds));
      console.log("coAuthorsToSend:", coAuthorsToSend);
      console.log("==================");
      
      if (coAuthorsToSend.length > 0) {
        coAuthorsToSend.forEach((coAuthorId) => {
          submitFormData.append("coAuthorIds", coAuthorId);
        });
      }
      
      submitFormData.append("volumeId", formData.volumeId);
      submitFormData.append("issueId", formData.issueId);
      submitFormData.append("articleType", formData.articleType);
      submitFormData.append("publishDate", formData.publishDate);
      submitFormData.append("pdfFile", pdfFile as File);

      if (formData.pageStart && formData.pageEnd) {
        submitFormData.append("pages[start]", formData.pageStart);
        submitFormData.append("pages[end]", formData.pageEnd);
      }

      if (formData.customDOI) {
        submitFormData.append("customDOI", formData.customDOI);
      }

      // Add publication options
      submitFormData.append("doiEnabled", String(publicationOptions.doiEnabled));
      submitFormData.append(
        "internetArchiveEnabled",
        String(publicationOptions.internetArchiveEnabled)
      );
      submitFormData.append(
        "emailNotificationEnabled",
        String(publicationOptions.emailNotificationEnabled)
      );

      await publicationApi.createManualArticle(submitFormData);
      toast.success("Article created and published successfully!");
      setShowConfirmDialog(false);
      router.push("/admin/articles/publication");
    } catch (error: unknown) {
      console.error("Publication error:", error);
      const errorMessage = getErrorMessage(error, "Failed to create article");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-journal-maroon"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/articles/publication"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
              Manual Article Upload
            </h1>
            <p className="text-gray-600 mt-1">
              Create articles directly for special publications or migrations
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="border-journal-maroon/20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-journal-maroon">
                Article Information
              </h2>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Article title"
                  className="border-journal-maroon/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Abstract *</Label>
                <Textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  placeholder="Article abstract"
                  className="border-journal-maroon/20 min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                  className="border-journal-maroon/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Article Type *</Label>
                <Select
                  value={formData.articleType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, articleType: value }))
                  }
                >
                  <SelectTrigger className="border-journal-maroon/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Author (Primary) *</Label>
                <Select
                  value={formData.authorId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, authorId: value }))
                  }
                  required
                >
                  <SelectTrigger className="border-journal-maroon/20">
                    <SelectValue placeholder="Select primary author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author._id} value={author._id}>
                        {author.name} ({author.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Co-Authors (Optional)</Label>
                <div className="border border-journal-maroon/20 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                  {authors.map((author) => (
                    <div key={author._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`coauthor-${author._id}`}
                        checked={formData.coAuthorIds.includes(author._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              coAuthorIds: [...prev.coAuthorIds, author._id],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              coAuthorIds: prev.coAuthorIds.filter(
                                (id) => id !== author._id,
                              ),
                            }));
                          }
                        }}
                        disabled={formData.authorId === author._id}
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={`coauthor-${author._id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {author.name}
                        {formData.authorId === author._id && (
                          <span className="text-xs text-gray-500 ml-1">
                            (primary)
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-journal-maroon/20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-journal-maroon">
                Publication Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Volume *</Label>
                  <Select
                    value={formData.volumeId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        volumeId: value,
                        issueId: "",
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="border-journal-maroon/20">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {volumes.map((volume) => (
                        <SelectItem key={volume._id} value={volume._id}>
                          Volume {volume.volumeNumber} ({volume.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Issue *</Label>
                  <Select
                    value={formData.issueId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, issueId: value }))
                    }
                    disabled={!formData.volumeId}
                    required
                  >
                    <SelectTrigger className="border-journal-maroon/20">
                      <SelectValue
                        placeholder={
                          formData.volumeId ? "Select issue" : "Select volume first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {issues.map((issue) => (
                        <SelectItem key={issue._id} value={issue._id}>
                          Issue {issue.issueNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Page</Label>
                  <Input
                    type="number"
                    name="pageStart"
                    min="1"
                    placeholder="1"
                    value={formData.pageStart}
                    onChange={handleInputChange}
                    className="border-journal-maroon/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Page</Label>
                  <Input
                    type="number"
                    name="pageEnd"
                    min="1"
                    placeholder="20"
                    value={formData.pageEnd}
                    onChange={handleInputChange}
                    className="border-journal-maroon/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Publish Date *</Label>
                <Input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="border-journal-maroon/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Custom DOI (Optional)</Label>
                <Input
                  type="text"
                  name="customDOI"
                  placeholder="10.xxxx/custom.doi"
                  value={formData.customDOI}
                  onChange={handleInputChange}
                  className="border-journal-maroon/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* PDF Upload */}
          <Card className="border-journal-maroon/20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-journal-maroon">PDF File</h2>

              <div className="border-2 border-dashed border-journal-maroon/20 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <div className="text-center">
                    <p className="font-semibold text-journal-maroon">
                      Click to upload PDF
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum size: 10 MB
                    </p>
                  </div>
                </label>
              </div>

              {pdfFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800">{pdfFile.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publication Options */}
          <Card className="border-journal-maroon/20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-journal-maroon">
                Publication Options
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="doiEnabled"
                    checked={publicationOptions.doiEnabled}
                    onChange={(e) =>
                      setPublicationOptions((prev) => ({
                        ...prev,
                        doiEnabled: e.target.checked,
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="doiEnabled"
                      className="font-medium text-sm cursor-pointer"
                    >
                      Register DOI with Crossref
                    </label>
                    <p className="text-xs text-gray-600">
                      Recommended for all publications
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="archiveEnabled"
                    checked={publicationOptions.internetArchiveEnabled}
                    onChange={(e) =>
                      setPublicationOptions((prev) => ({
                        ...prev,
                        internetArchiveEnabled: e.target.checked,
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="archiveEnabled"
                      className="font-medium text-sm cursor-pointer"
                    >
                      Upload to Internet Archive
                    </label>
                    <p className="text-xs text-gray-600">
                      Ensures long-term preservation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="emailEnabled"
                    checked={publicationOptions.emailNotificationEnabled}
                    onChange={(e) =>
                      setPublicationOptions((prev) => ({
                        ...prev,
                        emailNotificationEnabled: e.target.checked,
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="emailEnabled"
                      className="font-medium text-sm cursor-pointer"
                    >
                      Notify Subscribers via Email
                    </label>
                    <p className="text-xs text-gray-600">
                      Send announcement to all subscribers
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <p className="text-xs text-green-800">
                    ✓ Metadata generation (Google Scholar, BASE, CORE, SEO) is
                    always enabled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles/publication")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-journal-maroon to-journal-maroon-dark"
            >
              Continue to Confirmation
            </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
                Confirm Article Publication
              </DialogTitle>
              <DialogDescription>
                Please review the details before publishing this article
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Article Details
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Title:</strong> {formData.title}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {ARTICLE_TYPES.find((t) => t.value === formData.articleType)
                      ?.label}
                  </p>
                  <p>
                    <strong>Volume/Issue:</strong> Vol{" "}
                    {
                      volumes.find((v) => v._id === formData.volumeId)
                        ?.volumeNumber
                    }{" "}
                    / Issue{" "}
                    {issues.find((i) => i._id === formData.issueId)?.issueNumber}
                  </p>
                  <p>
                    <strong>Publish Date:</strong>{" "}
                    {new Date(formData.publishDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Publication Options
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>DOI Registration:</span>
                    <span
                      className={
                        publicationOptions.doiEnabled
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {publicationOptions.doiEnabled ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Internet Archive:</span>
                    <span
                      className={
                        publicationOptions.internetArchiveEnabled
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {publicationOptions.internetArchiveEnabled
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Notifications:</span>
                    <span
                      className={
                        publicationOptions.emailNotificationEnabled
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {publicationOptions.emailNotificationEnabled
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Metadata Generation:</span>
                    <span className="text-green-600 font-semibold">
                      ✓ Always Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Go Back
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Publishing..." : "Confirm and Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
