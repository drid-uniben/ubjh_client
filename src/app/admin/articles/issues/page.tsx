"use client";

import { useState, useEffect, useCallback } from "react";
import { issueApi, volumeApi, Issue, Volume } from "@/services/api";
import { AdminLayout } from '@/components/admin/AdminLayout'; // Added
import { useAuth } from '@/contexts/AuthContext'; // Added
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw,
  FileText,
  Calendar,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function IssuesManagementPage() {
  const { isAuthenticated } = useAuth(); // Added
  const [issues, setIssues] = useState<Issue[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    volume: "",
    issueNumber: "",
    description: "",
    publishDate: new Date().toISOString().split("T")[0],
  });
  
  const fetchIssues = useCallback(async () => {
  try {
    setIsLoading(true);
    const params = selectedVolume !== "all" ? { volume: selectedVolume } : {};
    const response = await issueApi.getIssues(params);
    setIssues(response.data);
  } catch (error) {
    console.error("Error fetching issues:", error);
    toast.error("Failed to load issues");
  } finally {
    setIsLoading(false);
  }
}, [selectedVolume]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchVolumes();
    fetchIssues();
  }, [isAuthenticated, fetchIssues]);

  const fetchVolumes = async () => {
    try {
      const response = await volumeApi.getVolumes();
      setVolumes(response.data);
    } catch (error) {
      console.error("Error fetching volumes:", error);
      toast.error("Failed to load volumes");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      volume: "",
      issueNumber: "",
      description: "",
      publishDate: new Date().toISOString().split("T")[0],
    });
    setEditingIssue(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = {
        volume: formData.volume,
        issueNumber: parseInt(formData.issueNumber),
        description: formData.description || undefined,
        publishDate: formData.publishDate,
      };

      if (editingIssue) {
        await issueApi.updateIssue(editingIssue._id, data);
        toast.success("Issue updated successfully");
      } else {
        await issueApi.createIssue(data);
        toast.success("Issue created successfully");
      }

      setShowDialog(false);
      resetForm();
      fetchIssues();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save issue";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    const volumeId = typeof issue.volume === "string" ? issue.volume : issue.volume._id;
    setFormData({
      volume: volumeId,
      issueNumber: issue.issueNumber.toString(),
      description: issue.description || "",
      publishDate: issue.publishDate.split("T")[0],
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingIssueId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingIssueId) return;

    try {
      await issueApi.deleteIssue(deletingIssueId);
      toast.success("Issue deleted successfully");
      fetchIssues();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete issue";
      toast.error(errorMsg);
    } finally {
      setShowDeleteDialog(false);
      setDeletingIssueId(null);
    }
  };

  const getVolumeForIssue = (issue: Issue) => {
    if (typeof issue.volume === "object") return issue.volume;
    return volumes.find((v) => v._id === issue.volume);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-journal-maroon" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-journal-maroon/10 to-purple-50 p-6 rounded-xl border border-journal-maroon/20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
              Issue Management
            </h1>
            <p className="text-gray-600 mt-1">Create and manage journal issues</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-journal-maroon to-journal-maroon-dark hover:from-journal-maroon-dark hover:to-journal-maroon text-white shadow-lg"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Issue
          </Button>
        </div>

        {/* Filter */}
        <Card className="border-journal-maroon/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium whitespace-nowrap">
                Filter by Volume:
              </Label>
              <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                <SelectTrigger className="w-[200px] border-journal-maroon/20">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Volumes</SelectItem>
                  {volumes.map((volume) => (
                    <SelectItem key={volume._id} value={volume._id}>
                      Volume {volume.volumeNumber} ({volume.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No issues found</p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedVolume !== "all"
                  ? "No issues in this volume"
                  : "Create your first issue"}
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const volume = getVolumeForIssue(issue);
              return (
                <Card
                  key={issue._id}
                  className="group hover:shadow-xl transition-all duration-300 border-journal-maroon/20 hover:border-journal-maroon"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-journal-maroon">
                          Issue {issue.issueNumber}
                        </h3>
                        {volume && (
                          <p className="text-sm text-gray-600">
                            Volume {volume.volumeNumber} ({volume.year})
                          </p>
                        )}
                      </div>
                      <BookOpen className="h-8 w-8 text-journal-maroon/30" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(issue.publishDate).toLocaleDateString()}
                      </span>
                    </div>

                    {issue.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {issue.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(issue)}
                        className="flex-1 border-journal-maroon text-journal-maroon hover:bg-journal-maroon/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(issue._id)}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
                {editingIssue ? "Edit Issue" : "Create New Issue"}
              </DialogTitle>
              <DialogDescription>
                {editingIssue
                  ? "Update issue information"
                  : "Create a new journal issue"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="volume">Volume *</Label>
                <Select
                  value={formData.volume}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, volume: value }))
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
                <Label htmlFor="issueNumber">Issue Number *</Label>
                <Input
                  id="issueNumber"
                  name="issueNumber"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.issueNumber}
                  onChange={handleInputChange}
                  className="border-journal-maroon/20 focus:border-journal-maroon"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date *</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="border-journal-maroon/20 focus:border-journal-maroon"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this issue"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[80px] border-journal-maroon/20 focus:border-journal-maroon"
                  rows={3}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="border-journal-maroon/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-journal-maroon to-journal-maroon-dark hover:from-journal-maroon-dark hover:to-journal-maroon text-white"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>{editingIssue ? "Update" : "Create"} Issue</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this issue and all its associations.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}