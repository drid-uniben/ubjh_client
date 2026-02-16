"use client";

import { useState, useEffect } from "react";
import { volumeApi, Volume } from "@/services/api";
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Image as ImageIcon,
  BookOpen,
  X,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function VolumesManagementPage() {
  const { isAuthenticated } = useAuth();
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingVolumeId, setDeletingVolumeId] = useState<string | null>(null);
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    volumeNumber: "",
    year: new Date().getFullYear().toString(),
    description: "",
    publishDate: new Date().toISOString().split("T")[0],
    coverImage: null as File | null,
  });

  useEffect(() => {
    if (!isAuthenticated) return; // Added
    fetchVolumes();
  }, [isAuthenticated]); // Added isAuthenticated to dependency array

  const fetchVolumes = async () => {
    try {
      setIsLoading(true);
      const response = await volumeApi.getVolumes();
      setVolumes(response.data);
    } catch (error: unknown) {
      console.error("Error fetching volumes:", error);
      toast.error("Failed to load volumes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      volumeNumber: "",
      year: new Date().getFullYear().toString(),
      description: "",
      publishDate: new Date().toISOString().split("T")[0],
      coverImage: null,
    });
    setCoverPreview(null);
    setEditingVolume(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("volumeNumber", formData.volumeNumber);
      data.append("year", formData.year);
      if (formData.description) data.append("description", formData.description);
      data.append("publishDate", formData.publishDate);
      if (formData.coverImage) data.append("coverImage", formData.coverImage);

      if (editingVolume) {
        await volumeApi.updateVolume(editingVolume._id, data);
        toast.success("Volume updated successfully");
      } else {
        await volumeApi.createVolume(data);
        toast.success("Volume created successfully");
      }

      setShowDialog(false);
      resetForm();
      fetchVolumes();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save volume";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (volume: Volume) => {
    setEditingVolume(volume);
    setFormData({
      volumeNumber: volume.volumeNumber.toString(),
      year: volume.year.toString(),
      description: volume.description || "",
      publishDate: volume.publishDate.split("T")[0],
      coverImage: null,
    });
    if (volume.coverImage) {
      setCoverPreview(volume.coverImage);
    }
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingVolumeId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingVolumeId) return;

    try {
      await volumeApi.deleteVolume(deletingVolumeId);
      toast.success("Volume deleted successfully");
      fetchVolumes();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete volume";
      toast.error(errorMsg);
    } finally {
      setShowDeleteDialog(false);
      setDeletingVolumeId(null);
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
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-journal-maroon/10 to-purple-50 p-6 rounded-xl border border-journal-maroon/20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
              Volume Management
            </h1>
            <p className="text-gray-600 mt-1">Create and manage journal volumes</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-journal-maroon to-journal-maroon-dark hover:from-journal-maroon-dark hover:to-journal-maroon text-white shadow-lg"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Volume
          </Button>
        </div>

        {/* Volumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volumes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No volumes created yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Create your first volume to get started
              </p>
            </div>
          ) : (
            volumes.map((volume) => (
              <Card
                key={volume._id}
                className="group hover:shadow-xl transition-all duration-300 border-journal-maroon/20 hover:border-journal-maroon"
              >
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-journal-maroon/10 to-purple-100 relative overflow-hidden">
                    {volume.coverImage ? (
                      <Image
                        src={volume.coverImage}
                        alt={`Volume ${volume.volumeNumber}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-24 w-24 text-journal-maroon/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-journal-maroon mb-2">
                      Volume {volume.volumeNumber}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Year {volume.year}</span>
                    </div>
                    {volume.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {volume.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(volume)}
                        className="flex-1 border-journal-maroon text-journal-maroon hover:bg-journal-maroon/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(volume._id)}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-journal-maroon to-purple-600 bg-clip-text text-transparent">
                {editingVolume ? "Edit Volume" : "Create New Volume"}
              </DialogTitle>
              <DialogDescription>
                {editingVolume
                  ? "Update volume information"
                  : "Create a new journal volume"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volumeNumber">Volume Number *</Label>
                  <Input
                    id="volumeNumber"
                    name="volumeNumber"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.volumeNumber}
                    onChange={handleInputChange}
                    className="border-journal-maroon/20 focus:border-journal-maroon"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="2020"
                    max="2100"
                    placeholder={new Date().getFullYear().toString()}
                    value={formData.year}
                    onChange={handleInputChange}
                    className="border-journal-maroon/20 focus:border-journal-maroon"
                    required
                  />
                </div>
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
                  placeholder="Brief description of this volume"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px] border-journal-maroon/20 focus:border-journal-maroon"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="coverImage"
                    className="cursor-pointer px-4 py-2 border-2 border-journal-maroon/20 rounded-md text-sm flex items-center hover:bg-journal-maroon/5 transition-colors"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {formData.coverImage ? "Change Image" : "Upload Image"}
                  </label>
                  {coverPreview && (
                    <div className="relative">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        width={80}
                        height={100}
                        className="object-cover rounded-lg border-2 border-journal-maroon/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, coverImage: null }));
                          setCoverPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
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
                    <>{editingVolume ? "Update" : "Create"} Volume</>
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
                This action cannot be undone. This will permanently delete this volume and all its associations.
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