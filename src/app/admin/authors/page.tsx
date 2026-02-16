"use client";

import { useState, useEffect, useCallback } from "react";
import * as api from "@/services/api";
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MoreVertical, Loader2, Eye, Send, RotateCw, FileText, User, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast, Toaster } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Author {
  _id: string;
  name: string;
  email: string;
  faculty?: string;
  assignedFaculty?: string;
  affiliation?: string;
  orcid?: string;
  credentialsSent: boolean;
  credentialsSentAt?: string;
  lastLogin?: string;
  manuscriptCount?: number;
  manuscriptCountBreakdown?: {
    main: number;
    coAuthored: number;
  };
  isActive: boolean;
}

interface Manuscript {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  authorRole?: string;
}

export default function AuthorsManagementPage() {
  const { isAuthenticated } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sendingCredentials, setSendingCredentials] = useState<string | null>(null);
  const [resendingCredentials, setResendingCredentials] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [authorManuscripts, setAuthorManuscripts] = useState<Manuscript[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchAuthors = useCallback(async () => {
  if (!isAuthenticated) return;
  try {
    const response = await api.getAuthors();
    setAuthors(response.data);
    setIsLoading(false);
  } catch (error: unknown) {
    console.error("Error fetching authors:", error);
    toast.error((error as Error).message || "Failed to load authors");
    setIsLoading(false);
  }
}, [isAuthenticated]);

useEffect(() => {
  fetchAuthors();
}, [fetchAuthors, isAuthenticated]);

  const handleSendCredentials = async (authorId: string) => {
    setSendingCredentials(authorId);
    try {
      await api.sendAuthorCredentials(authorId);
      toast.success("Credentials sent successfully.");
      
      // Update the author's status in the local state
      setAuthors(authors.map(a =>
        a._id === authorId ? { ...a, credentialsSent: true, credentialsSentAt: new Date().toISOString() } : a
      ));
    } catch (error: unknown) {
      console.error("Error sending credentials:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send credentials.";
      toast.error(errorMessage);
    } finally {
      setSendingCredentials(null);
    }
  };

  const handleResendCredentials = async (authorId: string) => {
    setResendingCredentials(authorId);
    try {
      await api.resendAuthorCredentials(authorId);
      toast.success("Credentials resent successfully.");
      
      // Update the credentials sent time
      setAuthors(authors.map(a =>
        a._id === authorId ? { ...a, credentialsSentAt: new Date().toISOString() } : a
      ));
    } catch (error: unknown) {
      console.error("Error resending credentials:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to resend credentials.";
      toast.error(errorMessage);
    } finally {
      setResendingCredentials(null);
    }
  };

  const handleViewDetails = async (author: Author) => {
    setSelectedAuthor(author);
    setLoadingDetails(true);
    setShowDetailsDialog(true);
    
    try {
      const response = await api.getAuthorDetails(author._id);
      setAuthorManuscripts(response.data.manuscripts);
    } catch (error) {
      console.error("Error fetching author details:", error);
      toast.error("Failed to load author details");
      setAuthorManuscripts([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { class: string; label: string }> = {
      submitted: { class: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Submitted' },
      under_review: { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Under Review' },
      in_reconciliation: { class: 'bg-purple-100 text-purple-800 border-purple-200', label: 'In Reconciliation' },
      approved: { class: 'bg-green-100 text-green-800 border-green-200', label: 'Approved' },
      rejected: { class: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
      minor_revision: { class: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Minor Revision' },
      major_revision: { class: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Major Revision' },
      revised: { class: 'bg-cyan-100 text-cyan-800 border-cyan-200', label: 'Revised' },
    };
    
    const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
    return <Badge className={`${config.class} border`}>{config.label}</Badge>;
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
      <div className="space-y-6 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Authors
            </h1>
            <p className="text-gray-600 mt-1">
              Manage author accounts and credentials
            </p>
          </div>
          <Button 
            onClick={fetchAuthors}
            variant="outline"
            className="border-journal-maroon text-journal-maroon hover:bg-journal-rose"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-journal-maroon">
            <CardHeader className="pb-2">
              <CardDescription>Total Authors</CardDescription>
              <CardTitle className="text-3xl text-journal-maroon">{authors.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription>Credentials Sent</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {authors.filter(a => a.credentialsSent).length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardDescription>With Manuscripts</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {authors.filter(a => (a.manuscriptCount || 0) > 0).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Authors Table */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-journal-off-white to-white border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-journal-maroon" />
              Author List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden lg:table-cell">Manuscripts</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden md:table-cell">Credential Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden xl:table-cell">Last Login</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No authors found.
                      </td>
                    </tr>
                  ) : (
                    authors.map((author) => (
                      <tr key={author._id} className="border-b hover:bg-journal-rose transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-journal-maroon text-white flex items-center justify-center text-xs font-bold">
                              {author.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span className="font-medium text-gray-900">{author.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{author.email}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium">{author.manuscriptCount || 0}</span>
                              {author.manuscriptCountBreakdown && (
                                <span className="text-xs text-gray-500 ml-1">
                                  ({author.manuscriptCountBreakdown.main}M / {author.manuscriptCountBreakdown.coAuthored}C)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {author.credentialsSent ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">Sent</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400">
                              <XCircle className="h-4 w-4" />
                              <span className="text-xs">Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs hidden xl:table-cell">
                          {author.lastLogin ? formatDate(author.lastLogin) : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onSelect={() => handleViewDetails(author)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {!author.credentialsSent && (
                                <DropdownMenuItem 
                                  onSelect={() => handleSendCredentials(author._id)}
                                  disabled={sendingCredentials === author._id}
                                >
                                  {sendingCredentials === author._id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Credentials
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              
                              {author.credentialsSent && (
                                <DropdownMenuItem 
                                  onSelect={() => handleResendCredentials(author._id)}
                                  disabled={resendingCredentials === author._id}
                                >
                                  {resendingCredentials === author._id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Resending...
                                    </>
                                  ) : (
                                    <>
                                      <RotateCw className="h-4 w-4 mr-2" />
                                      Resend Credentials
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Author Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-journal-maroon" />
                Author Details
              </DialogTitle>
              <DialogDescription>
                View comprehensive information about this author
              </DialogDescription>
            </DialogHeader>

            {selectedAuthor && (
              <div className="space-y-6 py-4">
                {/* Author Info Card */}
                <Card className="bg-gradient-to-br from-journal-off-white to-white border-journal-maroon">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-journal-maroon text-white flex items-center justify-center text-2xl font-bold">
                        {selectedAuthor.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedAuthor.name}</h3>
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <Mail className="h-4 w-4" />
                            {selectedAuthor.email}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {selectedAuthor.faculty && (
                            <div>
                              <span className="text-gray-500">Faculty:</span>
                              <p className="font-medium text-gray-900">{selectedAuthor.faculty}</p>
                            </div>
                          )}
                          {selectedAuthor.assignedFaculty && (
                            <div>
                              <span className="text-gray-500">Assigned Faculty:</span>
                              <p className="font-medium text-gray-900">{selectedAuthor.assignedFaculty}</p>
                            </div>
                          )}
                          {selectedAuthor.affiliation && (
                            <div>
                              <span className="text-gray-500">Affiliation:</span>
                              <p className="font-medium text-gray-900">{selectedAuthor.affiliation}</p>
                            </div>
                          )}
                          {selectedAuthor.orcid && (
                            <div>
                              <span className="text-gray-500">ORCID:</span>
                              <p className="font-medium text-gray-900">{selectedAuthor.orcid}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            {selectedAuthor.credentialsSent ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-600">
                              Credentials {selectedAuthor.credentialsSent ? 'Sent' : 'Not Sent'}
                            </span>
                          </div>
                          {selectedAuthor.credentialsSentAt && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {formatDate(selectedAuthor.credentialsSentAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manuscripts Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-journal-maroon" />
                    Manuscripts ({authorManuscripts.length})
                  </h4>
                  
                  {loadingDetails ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
                    </div>
                  ) : authorManuscripts.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No manuscripts found for this author</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {authorManuscripts.map((manuscript) => (
                        <Card key={manuscript._id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                                              <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-gray-900 break-words mb-1">
                                                                  {manuscript.title}
                                                                </h5>
                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                                                  <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(manuscript.createdAt).toLocaleDateString()}
                                                                  </span>
                                                                  {manuscript.authorRole && (
                                                                    <span className="flex items-center gap-1">
                                                                      <User className="h-3 w-3" />
                                                                      <strong>{manuscript.authorRole === 'main' ? 'Author' : 'Co-Author'}</strong>
                                                                    </span>
                                                                  )}
                                                                </div>
                                                              </div>                              <div className="flex-shrink-0">
                                {getStatusBadge(manuscript.status)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setShowDetailsDialog(false)} variant="outline">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Toaster />
    </AdminLayout>
  );
}