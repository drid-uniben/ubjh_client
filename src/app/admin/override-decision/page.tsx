"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Info,
  ChevronRight
} from 'lucide-react';
import { manuscriptAdminApi, type Manuscript } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Status flow configuration
const STATUS_FLOW = {
  submitted: {
    label: "Submitted",
    next: ["under_review"],
    color: "blue",
    description: "Initial submission state"
  },
  under_review: {
    label: "Under Review",
    next: ["approved", "rejected", "minor_revision", "major_revision", "in_reconciliation"],
    color: "yellow",
    description: "Being reviewed by assigned reviewers"
  },
  in_reconciliation: {
    label: "In Reconciliation",
    next: ["approved", "rejected", "minor_revision", "major_revision"],
    color: "purple",
    description: "Conflicting reviews - needs reconciliation"
  },
  minor_revision: {
    label: "Minor Revision",
    next: ["revised"],
    color: "orange",
    description: "Author needs to make minor revisions"
  },
  major_revision: {
    label: "Major Revision",
    next: ["revised"],
    color: "orange",
    description: "Author needs to make major revisions"
  },
  revised: {
    label: "Revised",
    next: ["under_review"],
    color: "cyan",
    description: "Author has submitted revisions"
  },
  approved: {
    label: "Approved",
    next: ["published"],
    color: "green",
    description: "Approved for publication"
  },
  published: {
    label: "Published",
    next: [],
    color: "green",
    description: "Published - end state"
  },
  rejected: {
    label: "Rejected",
    next: [],
    color: "red",
    description: "Rejected - end state"
  }
};

const ALL_STATUSES = Object.keys(STATUS_FLOW);

export default function OverrideDecisionPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Manuscript[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await manuscriptAdminApi.searchManuscripts(query, 20);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOverrideClick = (manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setNewStatus('');
    setOverrideReason('');
    setShowOverrideDialog(true);
  };

  const handleOverrideSubmit = async () => {
    if (!selectedManuscript || !newStatus || !overrideReason.trim()) {
      toast.error('Please select a status and provide a reason');
      return;
    }

    setIsOverriding(true);
    try {
      // Call a new API endpoint for silent status override
      const response = await manuscriptAdminApi.overrideStatus(
        selectedManuscript._id,
        {
          status: newStatus,
          reason: overrideReason,
          silentUpdate: true, // No emails sent
        }
      );

      if (response.success) {
        toast.success('Status overridden successfully');
        setShowOverrideDialog(false);
        // Refresh search results
        if (searchQuery) {
          handleSearch(searchQuery);
        }
      } else {
        toast.error(response.message || 'Failed to override status');
      }
    } catch (error) {
      console.error('Override failed:', error);
      toast.error('Failed to override status');
    } finally {
      setIsOverriding(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusInfo = STATUS_FLOW[status as keyof typeof STATUS_FLOW];
    if (!statusInfo) return 'gray';
    
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    
    return colorMap[statusInfo.color as keyof typeof colorMap];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Override Decision</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Manually override manuscript status without automated checks or notifications
          </p>
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action bypasses all validation checks and does not send any email notifications. Use with extreme caution.
            </p>
          </div>
        </div>

        {/* Status Flow Visualization */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Manuscript Status Flow
          </h2>
          <div className="space-y-4">
            {Object.entries(STATUS_FLOW).map(([status, info]) => (
              <div key={status} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                    {info.label}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{info.description}</p>
                  {info.next.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Next states:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {info.next.map((nextStatus, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nextStatus)}`}>
                              {STATUS_FLOW[nextStatus as keyof typeof STATUS_FLOW]?.label || nextStatus}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Manuscript</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by manuscript title, author name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-journal-maroon" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 border rounded-lg divide-y max-h-96 overflow-y-auto">
              {searchResults.map((manuscript) => (
                <div key={manuscript._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{manuscript.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {manuscript.submitter.name} ({manuscript.submitter.email})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(manuscript.status)}`}>
                          {STATUS_FLOW[manuscript.status as keyof typeof STATUS_FLOW]?.label || manuscript.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Submitted: {new Date(manuscript.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOverrideClick(manuscript)}
                      className="bg-red-600 hover:bg-red-700 flex-shrink-0"
                      size="sm"
                    >
                      Override Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
            <div className="mt-4 text-center py-8 text-gray-500">
              No manuscripts found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Override Dialog */}
        <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Override Manuscript Status
              </DialogTitle>
              <DialogDescription>
                This will change the manuscript status without any validation or notifications.
              </DialogDescription>
            </DialogHeader>

            {selectedManuscript && (
              <div className="py-4 space-y-6">
                {/* Manuscript Info */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedManuscript.title}</h4>
                  <p className="text-sm text-gray-600">
                    Author: {selectedManuscript.submitter.name}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Current Status: </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(selectedManuscript.status)}`}>
                      {STATUS_FLOW[selectedManuscript.status as keyof typeof STATUS_FLOW]?.label || selectedManuscript.status}
                    </span>
                  </div>
                </div>

                {/* New Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status *
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_FLOW[status as keyof typeof STATUS_FLOW].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Override *
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Provide a detailed reason for this manual status override..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This reason will be logged for audit purposes.
                  </p>
                </div>

                {/* Warning */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Bypassed Checks:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>No review completion verification</li>
                        <li>No faculty assignment check</li>
                        <li>No reviewer assignment validation</li>
                        <li>No email notifications sent</li>
                        <li>No workflow validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowOverrideDialog(false)}
                disabled={isOverriding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOverrideSubmit}
                disabled={isOverriding || !newStatus || !overrideReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isOverriding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Overriding...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Override
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}