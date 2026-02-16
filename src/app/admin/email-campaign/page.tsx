"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { emailCampaignApi, type EmailRecipient } from "@/services/api";
import { toast, Toaster } from "sonner";
import { Mail, Search, Users, Eye, Send, Plus, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EmailCampaignPage() {
  const { isAuthenticated } = useAuth();
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Email composition
  const [subject, setSubject] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewRecipient, setPreviewRecipient] = useState<{ name: string; email: string } | null>(null);

  // Sending
  const [isSending, setIsSending] = useState(false);

  const [attachments, setAttachments] = useState<File[]>([]);

  // Fetch recipients
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecipients = async () => {
      setIsLoading(true);
      try {
        const response = await emailCampaignApi.getRecipients({
          role: roleFilter !== "all" ? roleFilter : undefined,
          manuscriptStatus: statusFilter !== "all" ? statusFilter : undefined,
          search: searchTerm || undefined,
        });
        setRecipients(response.data);
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
        toast.error("Failed to load recipients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipients();
  }, [isAuthenticated, roleFilter, statusFilter, searchTerm]);

  const toggleRecipient = (userId: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedRecipients(newSelected);
  };

  const selectAll = () => {
    setSelectedRecipients(new Set(recipients.map(r => r.userId)));
  };

  const clearSelection = () => {
    setSelectedRecipients(new Set());
  };

  const insertVariable = (variable: string) => {
    setBodyContent(prev => prev + `{{${variable}}}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  // Validate file types
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const validFiles = files.filter(file => {
    if (!validTypes.includes(file.type)) {
      toast.error(`${file.name} is not a supported file type`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name} is too large (max 10MB)`);
      return false;
    }
    return true;
  });
  
  if (attachments.length + validFiles.length > 5) {
    toast.error('Maximum 5 attachments allowed');
    return;
  }
  
  setAttachments(prev => [...prev, ...validFiles]);
};

const removeAttachment = (index: number) => {
  setAttachments(prev => prev.filter((_, i) => i !== index));
};

// Update handlePreview
const handlePreview = async () => {
  if (selectedRecipients.size === 0) {
    toast.error("Please select at least one recipient");
    return;
  }

  try {
    const response = await emailCampaignApi.previewEmail({
      recipientIds: Array.from(selectedRecipients),
      subject,
      headerTitle,
      bodyContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setPreviewHtml(response.data.previewHtml);
    setPreviewRecipient(response.data.previewRecipient);
    setShowPreview(true);
  } catch (error) {
    console.error("Preview failed:", error);
    toast.error("Failed to generate preview");
  }
};

  const handleSend = async () => {
  if (selectedRecipients.size === 0) {
    toast.error("Please select at least one recipient");
    return;
  }

  if (!subject || !bodyContent) {
    toast.error("Please fill in subject and body content");
    return;
  }

  setIsSending(true);
  try {
    const response = await emailCampaignApi.sendCampaign({
      recipientIds: Array.from(selectedRecipients),
      subject,
      headerTitle: headerTitle || subject,
      bodyContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    toast.success(response.message);
    
    // Reset form
    setSubject("");
    setHeaderTitle("");
    setBodyContent("");
    setAttachments([]);
    clearSelection();
  } catch (error) {
    console.error("Send failed:", error);
    toast.error("Failed to send email campaign");
  } finally {
    setIsSending(false);
  }
};

  const availableVariables = [
    { key: "name", label: "Recipient Name" },
    { key: "email", label: "Email Address" },
    { key: "manuscriptTitle", label: "Manuscript Title" },
    { key: "manuscriptId", label: "Manuscript ID" },
    { key: "manuscriptStatus", label: "Manuscript Status" },
    { key: "role", label: "User Role" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Campaign Manager</h1>
            <p className="text-gray-600 mt-1">Send customized emails to authors and submitters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipient Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-journal-maroon" />
                Recipients ({selectedRecipients.size} selected)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="all">All Roles</option>
                    <option value="author">Authors</option>
                    <option value="reviewer">Reviewers</option>
                  </select>
                </div>

                <div>
                  <Label>Manuscript Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="minor_revision">Minor Revision</option>
                    <option value="major_revision">Major Revision</option>
                  </select>
                </div>

                <div>
                  <Label>Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={selectAll} variant="outline" size="sm" className="flex-1">
                    Select All
                  </Button>
                  <Button onClick={clearSelection} variant="outline" size="sm" className="flex-1">
                    Clear
                  </Button>
                </div>
              </div>

              {/* Recipient List */}
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-journal-maroon" />
                  </div>
                ) : recipients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No recipients found
                  </div>
                ) : (
                  recipients.map((recipient) => (
                    <div
                      key={recipient.userId}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedRecipients.has(recipient.userId) ? "bg-journal-rose" : ""
                      }`}
                      onClick={() => toggleRecipient(recipient.userId)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{recipient.name}</p>
                          <p className="text-xs text-gray-500">{recipient.email}</p>
                          {recipient.manuscriptTitle && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {recipient.manuscriptTitle}
                            </p>
                          )}
                        </div>
                        {selectedRecipients.has(recipient.userId) && (
                          <div className="ml-2 flex-shrink-0">
                            <div className="w-5 h-5 bg-journal-maroon rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Composer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-journal-maroon" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subject *</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Header Title (Optional)</Label>
                <Input
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Appears in red header bar (defaults to subject)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Dynamic Variables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {variable.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click to insert variables. They will be replaced with actual values for each recipient.
                </p>
              </div>

              <div>
                <Label>Email Body *</Label>
                <RichTextEditor
                  value={bodyContent}
                  onChange={setBodyContent}
                  placeholder="Dear {{name}},&#10;&#10;Your manuscript titled '{{manuscriptTitle}}' is currently {{manuscriptStatus}}."
                  className="mt-1"
                />
              </div>

              <div>
  <Label>Attachments (Optional)</Label>
  <div className="mt-2">
    <input
      type="file"
      id="attachments"
      multiple
      accept="image/*,.pdf,.docx"
      onChange={handleFileChange}
      className="hidden"
    />
    <label
      htmlFor="attachments"
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Attachment
    </label>
    <p className="text-xs text-gray-500 mt-1">
      Supports images, PDFs, and DOCX files. Max 10MB per file, up to 5 files.
    </p>
  </div>
  
  {attachments.length > 0 && (
    <div className="mt-3 space-y-2">
      {attachments.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {file.type.startsWith('image/') && (
              <Image 
                src={URL.createObjectURL(file)} 
                alt={file.name}
                width={40}
                height={40}
                className="object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            onClick={() => removeAttachment(index)}
            variant="ghost"
            size="sm"
            className="ml-2"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  )}
</div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  disabled={selectedRecipients.size === 0 || !bodyContent}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={selectedRecipients.size === 0 || !subject || !bodyContent || isSending}
                  className="bg-journal-maroon hover:bg-journal-maroon-dark"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to {selectedRecipients.size} Recipient{selectedRecipients.size !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Modal */}
<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Email Preview</DialogTitle>
      {previewRecipient && (
        <p className="text-sm text-gray-500">
          Preview for: {previewRecipient.name} ({previewRecipient.email})
        </p>
      )}
    </DialogHeader>
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-gray-50">
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
      
      {attachments.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Attachments ({attachments.length}):
          </p>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <span>📎</span>
                <span>{file.name}</span>
                <span className="text-gray-400">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
      </div>
      <Toaster />
    </AdminLayout>
  );
}