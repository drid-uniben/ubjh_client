"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import * as api from "@/services/api";
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Check, AlertCircle, Clock, MoreVertical, Building2, X, Loader2, UserPlus, ExternalLink, ChevronRight, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast, Toaster } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Invitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired" | "added";
  created: string;
  expires: string | null;
  assignedFaculty?: string; // Add this line
}

interface AuthorFormState {
  name: string;
  email: string;
  faculty: string;
  affiliation: string;
  orcid?: string;
}

interface Faculty {
  faculty: string;
  departments: string[];
}

export default function AuthorInvitationsPage() {
  const { isAuthenticated } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [facultiesForAssign, setFacultiesForAssign] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false);
  const [showAddAuthorDialog, setShowAddAuthorDialog] = useState<boolean>(false);
  const [showAssignFacultyDialog, setShowAssignFacultyDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Invitation | null>(null);
  const [selectedFacultyForAssign, setSelectedFacultyForAssign] = useState<string>("");
  const [assigningFaculty, setAssigningFaculty] = useState(false);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  
  const [authorForm, setAuthorForm] = useState<AuthorFormState>({
    name: "",
    email: "",
    faculty: "",
    affiliation: "",
    orcid: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deletingInvitation, setDeletingInvitation] = useState<Invitation | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.getAuthorInvitations();
        setInvitations(response.data || []);
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Error fetching invitations:", error);
        setError((error as Error).message || "Failed to load invitations");
        setIsLoading(false);
      }
    };
  
    fetchInvitations();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchFacultiesForAssign = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await api.manuscriptAdminApi.getFacultiesWithData();
        const facultiesData = response.data;
        const facultiesArray = Object.entries(facultiesData).map(([faculty, departments]) => ({
          faculty,
          departments: departments as string[],
        }));
        setFacultiesForAssign(facultiesArray);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
      }
    };

    fetchFacultiesForAssign();
  }, [isAuthenticated]);

  const handleSendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
  
    try {
      await api.inviteAuthor(email);
      toast.success(`Invitation sent to ${email}`);
  
      const response = await api.getAuthorInvitations();
      setInvitations(response.data);
  
      setEmail("");
      setTimeout(() => setShowInviteDialog(false), 1500);
    } catch (error: unknown) {
      const errorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send invitation";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendInvitation = async (id: string) => {
    try {
      await api.resendAuthorInvitation(id);
      const response = await api.getAuthorInvitations();
      setInvitations(response.data);
      toast.success("Invitation resent successfully");
    } catch (error: unknown) {
      console.error("Error resending invitation:", error);
      toast.error((error as Error).message || "Failed to resend invitation");
    }
  };

  const deleteInvitation = async (id: string) => {
    const invitationToDelete = invitations.find((invitation) => invitation.id === id);
    if (invitationToDelete) {
      setDeletingInvitation(invitationToDelete);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirmation = async () => {
    if (deletingInvitation) {
      try {
        await api.deleteAuthor(deletingInvitation.id);
        setInvitations(invitations.filter((invitation) => invitation.id !== deletingInvitation.id));
        toast.success("Invitation deleted successfully");
      } catch (error: unknown) {
        console.error("Error deleting invitation:", error);
        const errorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete invitation";
        toast.error(errorMsg);
      } finally {
        setShowDeleteDialog(false);
        setDeletingInvitation(null);
      }
    }
  };

  const validateAuthorForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!authorForm.name.trim()) {
      errors.name = "Full Name is required";
    }
    if (!authorForm.email.trim()) {
      errors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorForm.email)) {
      errors.email = "Invalid email format";
    }
    if (!authorForm.faculty.trim()) {
      errors.faculty = "Faculty/Department is required";
    }
    if (!authorForm.affiliation.trim()) {
      errors.affiliation = "Affiliation is required";
    }
    if (!authorForm.orcid?.trim()) {
      errors.orcid = "ORCID is required";
    } else if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(authorForm.orcid))
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAuthor = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAuthorForm()) {
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await api.addAuthorProfile(authorForm);
      toast.success(`Author profile created for ${authorForm.email}`);

      setAuthorForm({
        name: "",
        email: "",
        faculty: "",
        affiliation: "",
        orcid: "",
      });

      const response = await api.getAuthorInvitations();
      setInvitations(response.data);

      setTimeout(() => setShowAddAuthorDialog(false), 1500);
    } catch (error: unknown) {
      const errorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create author profile";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAuthorForm({
      ...authorForm,
      [name]: value,
    });
  };

  const handleAssignFaculty = async (facultyName: string) => {
    if (!selectedAuthor) return;
    
    setAssigningFaculty(true);
    toast.info("Assigning faculty...");
    
    try {
      const response = await api.assignFacultyToUser(selectedAuthor.id, facultyName);
      
      if (response.success) {
        toast.success("Faculty assigned successfully!");
        setShowAssignFacultyDialog(false);
        
        const updatedInvitations = await api.getAuthorInvitations();
        setInvitations(updatedInvitations.data);
      } else {
        toast.error("Failed to assign faculty");
      }
    } catch (error) {
      console.error("Failed to assign faculty:", error);
      toast.error("Error while assigning faculty");
    } finally {
      setAssigningFaculty(false);
    }
  };

  const getStatusBadgeClass = (status: Invitation['status']) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "accepted":
        return "bg-green-100 text-green-800 border border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "added":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status: Invitation['status']) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "accepted":
        return <Check className="h-4 w-4 mr-1" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "added":
        return <Check className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
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
              Author Management
            </h1>
            <p className="text-gray-600 mt-1">
              Invite and manage authors for the platform
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button 
              onClick={() => setShowInviteDialog(true)}
              className="bg-journal-maroon hover:bg-journal-maroon-dark text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Invite Author
            </Button>
            
            <Button 
              onClick={() => setShowAddAuthorDialog(true)}
              variant="outline"
              className="border-journal-maroon text-journal-maroon hover:bg-journal-rose"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Author
            </Button>
          </div>
        </div>

        {/* Invitations Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-journal-off-white to-white border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-journal-maroon" />
              Author Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">Created</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden sm:table-cell">Expires</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Faculty</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(invitations) || invitations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No invitations found.
                      </td>
                    </tr>
                  ) : (
                    invitations.map((invitation) => (
                      <tr key={invitation?.id} className="border-b hover:bg-journal-rose transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{invitation?.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invitation?.status)}`}>
                            {getStatusIcon(invitation?.status)}
                            {invitation?.status ? 
                              invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)
                              : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{invitation?.created || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{invitation?.expires || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {invitation?.assignedFaculty ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-journal-rose text-journal-maroon">
                              {invitation.assignedFaculty}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(invitation?.status === "accepted" || invitation?.status === "added") && (
                                <DropdownMenuItem onSelect={() => {
                                  setSelectedAuthor(invitation);
                                  setSelectedFacultyForAssign(invitation.assignedFaculty || "");
                                  setTimeout(() => setShowAssignFacultyDialog(true), 50);
                                }}>
                                  <Building2 className="h-4 w-4 mr-2" />
                                  {invitation.assignedFaculty ? "Change Faculty" : "Assign Faculty"}
                                </DropdownMenuItem>
                              )}
                              {(invitation?.status === "expired") && (
                                <DropdownMenuItem onSelect={() => resendInvitation(invitation.id)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Resend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onSelect={() => deleteInvitation(invitation.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
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

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Author</DialogTitle>
              <DialogDescription>
                Send an invitation email to a new author to join the platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendInvite} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="author@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-journal-maroon hover:bg-journal-maroon-dark">
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Author Dialog */}
        <Dialog open={showAddAuthorDialog} onOpenChange={setShowAddAuthorDialog}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Author Profile</DialogTitle>
              <DialogDescription>
                Create a new author profile directly. The author will receive login credentials by email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAuthor} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-name">Full Name *</Label>
                  <Input
                    id="author-name"
                    name="name"
                    placeholder="Dr. John Doe"
                    value={authorForm.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author-email">Email Address *</Label>
                  <Input
                    id="author-email"
                    name="email"
                    type="email"
                    placeholder="author@example.com"
                    value={authorForm.email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="author-faculty">Faculty/Department *</Label>
                  <Input
                    id="author-faculty"
                    name="faculty"
                    placeholder="e.g., Faculty of Science, Computer Science"
                    value={authorForm.faculty}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.faculty && <p className="text-red-500 text-xs mt-1">{formErrors.faculty}</p>}
                  <p className="text-xs text-gray-500">Comma-separated: Faculty, Department</p>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="author-affiliation">Affiliation *</Label>
                  <Textarea
                    id="author-affiliation"
                    name="affiliation"
                    placeholder="e.g., University of Benin"
                    value={authorForm.affiliation}
                    onChange={handleInputChange}
                    rows={2}
                    required
                  />
                  {formErrors.affiliation && <p className="text-red-500 text-xs mt-1">{formErrors.affiliation}</p>}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="author-orcid">ORCID * (Required)</Label>
                  <Input
                    id="author-orcid"
                    name="orcid"
                    placeholder="0000-0000-0000-0000"
                    value={authorForm.orcid}
                    onChange={handleInputChange}
                  />
                  {formErrors.orcid && <p className="text-red-500 text-xs mt-1">{formErrors.orcid}</p>}
                  <p className="text-xs text-gray-500">Format: 0000-0000-0000-0000</p>
                </div>
              </div>
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddAuthorDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-journal-maroon hover:bg-journal-maroon-dark">
                  {isSubmitting ? "Creating..." : "Create Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Assign Faculty Dialog */}
        <Dialog open={showAssignFacultyDialog} onOpenChange={(open) => {
          setShowAssignFacultyDialog(open);
          if (!open) {
            setSelectedAuthor(null);
            setSelectedFacultyForAssign("");
            setExpandedFaculty(null);
          }
        }}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-journal-maroon" />
                Assign Faculty
              </DialogTitle>
              <DialogDescription>
                Select a faculty to assign this author. You can view departments within each faculty for additional information.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedAuthor && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Author:</strong> {selectedAuthor.email}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {facultiesForAssign.map((faculty) => (
                  <div
                    key={faculty.faculty}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-journal-maroon transition-colors"
                  >
                    <div className="flex items-center justify-between p-4 bg-white">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {faculty.faculty}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {faculty.departments.length} departments
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setSelectedFacultyForAssign(faculty.faculty);
                            handleAssignFaculty(faculty.faculty);
                          }}
                          disabled={assigningFaculty}
                          className="bg-journal-maroon hover:bg-journal-maroon-dark text-white text-sm"
                          size="sm"
                        >
                          {assigningFaculty && selectedFacultyForAssign === faculty.faculty ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Assign
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setExpandedFaculty(
                            expandedFaculty === faculty.faculty ? null : faculty.faculty
                          )}
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-journal-maroon"
                        >
                          {expandedFaculty === faculty.faculty ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {expandedFaculty === faculty.faculty && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          Departments:
                        </h4>
                        <ul className="space-y-1">
                          {faculty.departments.map((dept, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-gray-600 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-journal-maroon rounded-full"></span>
                              {dept}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAssignFacultyDialog(false)}
                disabled={assigningFaculty}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the invitation for{" "}
                <strong>{deletingInvitation?.email}</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmation}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Toaster />
    </AdminLayout>
  );
} 