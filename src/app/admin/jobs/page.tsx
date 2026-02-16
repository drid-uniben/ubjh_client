"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  RotateCcw,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { failedJobsApi } from "@/services/api";
import { AxiosError } from "axios";

interface FailedJob {
  _id: string;
  jobType: string;
  articleId: {
    _id: string;
    title: string;
    doi?: string;
  };
  errorMessage: string;
  errorStack?: string;
  attemptCount: number;
  lastAttemptAt: string;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

interface Statistics {
  totalFailed: number;
  totalResolved: number;
  failedByType: Array<{
    _id: string;
    count: number;
  }>;
}

interface FailedJobsParams {
  page: number;
  limit: number;
  jobType?: string;
  resolved?: boolean;
}

export default function FailedJobsPage() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<FailedJob[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<FailedJob | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRetryAllDialog, setShowRetryAllDialog] = useState(false);
  const [showDeleteResolvedDialog, setShowDeleteResolvedDialog] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Filters
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [resolvedFilter, setResolvedFilter] = useState("unresolved");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchJobs = useCallback(async () => {
  try {
    setIsLoading(true);
    const params: FailedJobsParams = { page, limit: 20 };
    
    if (jobTypeFilter !== "all") {
      params.jobType = jobTypeFilter;
    }
    
    if (resolvedFilter !== "all") {
      params.resolved = resolvedFilter === "resolved";
    }

    const response = await failedJobsApi.getFailedJobs(params);
    setJobs(response.data);
    setTotalPages(response.pages);
  } catch (error) {
    console.error("Error fetching failed jobs:", error);
    toast.error("Failed to load jobs");
  } finally {
    setIsLoading(false);
  }
}, [jobTypeFilter, resolvedFilter, page]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchJobs();
    fetchStatistics();
  }, [isAuthenticated, jobTypeFilter, resolvedFilter, page, fetchJobs]);


  const fetchStatistics = async () => {
    try {
      const response = await failedJobsApi.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      setIsRetrying(true);
      await failedJobsApi.retryFailedJob(jobId);
      toast.success("Job retry scheduled successfully");
      fetchJobs();
      fetchStatistics();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to retry job");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRetryAll = () => {
    setShowRetryAllDialog(true);
  };

  const confirmRetryAll = async () => {
    setShowRetryAllDialog(false);
    try {
      setIsRetrying(true);
      const response = await failedJobsApi.retryAllFailedJobs();
      toast.success(`${response.retriedCount} jobs scheduled for retry`);
      fetchJobs();
      fetchStatistics();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to retry jobs");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleMarkAsResolved = async (jobId: string) => {
    try {
      await failedJobsApi.markAsResolved(jobId);
      toast.success("Job marked as resolved");
      fetchJobs();
      fetchStatistics();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to mark as resolved");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDeleteResolved = () => {
    setShowDeleteResolvedDialog(true);
  };

  const confirmDeleteResolved = async () => {
    setShowDeleteResolvedDialog(false);
    try {
      const response = await failedJobsApi.deleteResolvedJobs();
      toast.success(`${response.deletedCount} resolved jobs deleted`);
      fetchJobs();
      fetchStatistics();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete resolved jobs");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const viewJobDetails = (job: FailedJob) => {
    setSelectedJob(job);
    setShowDetailsDialog(true);
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      doi_registration: "DOI Registration",
      indexing_metadata: "Indexing Metadata",
      preservation: "Preservation",
      email_notification: "Email Notification",
    };
    return labels[type] || type;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      doi_registration: "bg-red-100 text-red-800 border-red-200",
      indexing_metadata: "bg-blue-100 text-blue-800 border-blue-200",
      preservation: "bg-purple-100 text-purple-800 border-purple-200",
      email_notification: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (isLoading && jobs.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#7A0019]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A0019]/10 to-purple-50 p-6 rounded-xl border border-[#7A0019]/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-purple-600 bg-clip-text text-transparent">
                Failed Jobs Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and retry failed background jobs</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRetryAll}
                disabled={isRetrying || !statistics || statistics.totalFailed === 0}
                className="bg-gradient-to-r from-[#7A0019] to-[#5A0A1A] hover:from-[#5A0A1A] hover:to-[#7A0019] text-white"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retry All
                  </>
                )}
              </Button>
              <Button
                onClick={handleDeleteResolved}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clean Up
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-[#7A0019]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Failed</p>
                    <p className="text-3xl font-bold text-[#7A0019]">
                      {statistics.totalFailed}
                    </p>
                  </div>
                  <XCircle className="h-12 w-12 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#7A0019]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-green-600">
                      {statistics.totalResolved}
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </CardContent>
            </Card>

            {statistics.failedByType.map((item) => (
              <Card key={item._id} className="border-[#7A0019]/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {getJobTypeLabel(item._id)}
                      </p>
                      <p className="text-3xl font-bold text-[#7A0019]">
                        {item.count}
                      </p>
                    </div>
                    <AlertCircle className="h-12 w-12 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Filters */}
        <Card className="border-[#7A0019]/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Job Type</Label>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger className="border-[#7A0019]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="doi_registration">DOI Registration</SelectItem>
                    <SelectItem value="indexing_metadata">Indexing Metadata</SelectItem>
                    <SelectItem value="preservation">Preservation</SelectItem>
                    <SelectItem value="email_notification">Email Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
                  <SelectTrigger className="border-[#7A0019]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unresolved">Unresolved</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={fetchJobs}
                variant="outline"
                className="border-[#7A0019] text-[#7A0019]"
              >
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="border-[#7A0019]/20">
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No failed jobs found</p>
                <p className="text-gray-400 text-sm mt-1">
                  All jobs are running successfully!
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card
                key={job._id}
                className={`border-2 transition-all duration-200 hover:shadow-xl ${
                  job.resolved
                    ? "border-green-200 bg-green-50/50"
                    : "border-red-200 bg-red-50/50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getJobTypeColor(
                            job.jobType
                          )}`}
                        >
                          {getJobTypeLabel(job.jobType)}
                        </span>
                        {job.resolved && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#7A0019] mb-2">
                        {job.articleId?.title || "Article Deleted"}
                      </h3>

                      {job.articleId?.doi && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>DOI:</strong> {job.articleId.doi}
                        </p>
                      )}

                      <div className="bg-white rounded-lg p-3 mb-3 border border-red-200">
                        <p className="text-sm font-semibold text-red-800 mb-1">
                          Error Message:
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {job.errorMessage}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        <div>
                          <strong>Attempts:</strong> {job.attemptCount}
                        </div>
                        <div>
                          <strong>Last Attempt:</strong>{" "}
                          {new Date(job.lastAttemptAt).toLocaleString()}
                        </div>
                        <div>
                          <strong>Created:</strong>{" "}
                          {new Date(job.createdAt).toLocaleString()}
                        </div>
                        {job.resolvedAt && (
                          <div>
                            <strong>Resolved:</strong>{" "}
                            {new Date(job.resolvedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewJobDetails(job)}
                        className="border-[#7A0019] text-[#7A0019] hover:bg-[#7A0019]/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>

                      {!job.resolved && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleRetryJob(job._id)}
                            disabled={isRetrying}
                            className="bg-gradient-to-r from-[#7A0019] to-[#5A0A1A] text-white"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsResolved(job._id)}
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="border-[#7A0019]/20"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="border-[#7A0019]/20"
            >
              Next
            </Button>
          </div>
        )}

        {/* Job Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-[#7A0019] to-purple-600 bg-clip-text text-transparent">
                Job Details
              </DialogTitle>
              <DialogDescription>
                Detailed information about this failed job
              </DialogDescription>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Job Type
                  </Label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getJobTypeColor(
                        selectedJob.jobType
                      )}`}
                    >
                      {getJobTypeLabel(selectedJob.jobType)}
                    </span>
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Article
                  </Label>
                  <p className="mt-1 text-gray-600">
                    {selectedJob.articleId?.title || "Article Deleted"}
                  </p>
                  {selectedJob.articleId?.doi && (
                    <p className="text-sm text-gray-500 mt-1">
                      DOI: {selectedJob.articleId.doi}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Error Message
                  </Label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedJob.errorMessage}
                    </p>
                  </div>
                </div>

                {selectedJob.errorStack && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Error Stack Trace
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                        {selectedJob.errorStack}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Attempt Count
                    </Label>
                    <p className="mt-1 text-gray-600">{selectedJob.attemptCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Status
                    </Label>
                    <p className="mt-1">
                      {selectedJob.resolved ? (
                        <span className="text-green-600 font-semibold">
                          Resolved
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Unresolved
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Created At
                    </Label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedJob.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Last Attempt
                    </Label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedJob.lastAttemptAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedJob.resolvedAt && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Resolved At
                    </Label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedJob.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
                className="border-[#7A0019]/20"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Retry All Confirmation Dialog */}
        <Dialog open={showRetryAllDialog} onOpenChange={setShowRetryAllDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retry All Failed Jobs?</DialogTitle>
              <DialogDescription>
                This will attempt to re-run all currently failed background jobs.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRetryAllDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#7A0019] text-white hover:bg-[#5A0A1A]"
                onClick={confirmRetryAll}
              >
                Retry All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Resolved Confirmation Dialog */}
        <Dialog open={showDeleteResolvedDialog} onOpenChange={setShowDeleteResolvedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clean Up Resolved Jobs?</DialogTitle>
              <DialogDescription>
                This will permanently delete all jobs that have been marked as resolved.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteResolvedDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteResolved}
              >
                Clean Up
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}