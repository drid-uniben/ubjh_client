"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface PublicationOptions {
  doiEnabled: boolean;
  internetArchiveEnabled: boolean;
  emailNotificationEnabled: boolean;
}

interface ArticleDetails {
  title: string;
  author: string;
  volume: number;
  issue: number;
  articleType: string;
}

interface PublicationConfirmationModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: PublicationOptions) => void;
  options: PublicationOptions;
  articleDetails: ArticleDetails;
}

type ConfirmationStep = 'doi' | 'archive' | 'email' | 'final';

export function PublicationConfirmationModals({
  isOpen,
  onClose,
  onConfirm,
  options,
  articleDetails,
}: PublicationConfirmationModalsProps) {
  const [currentStep, setCurrentStep] = useState<ConfirmationStep>('doi');
  const [confirmedOptions, setConfirmedOptions] = useState<PublicationOptions>(options);

  const handleNext = () => {
    const steps: ConfirmationStep[] = ['doi', 'archive', 'email', 'final'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: ConfirmationStep[] = ['doi', 'archive', 'email', 'final'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleConfirmFinal = () => {
    onConfirm(confirmedOptions);
    handleReset();
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCurrentStep('doi');
    setConfirmedOptions(options);
  };

  const renderDOIStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {confirmedOptions.doiEnabled ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          DOI Registration Confirmation
        </DialogTitle>
        <DialogDescription>
          {confirmedOptions.doiEnabled
            ? "You have selected to register a DOI for this article."
            : "You have chosen NOT to register a DOI for this article."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <p className="text-sm text-gray-700 mb-4">
          {confirmedOptions.doiEnabled
            ? "A DOI (Digital Object Identifier) will be registered with Crossref, making this article permanently citable and easier to discover."
            : "Without a DOI, this article will be harder to cite and discover. This is NOT recommended for peer-reviewed research articles."}
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-semibold mb-1">Article: {articleDetails.title}</p>
          <p className="text-xs text-gray-600">Author: {articleDetails.author}</p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel Publication
        </Button>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 'doi'}
        >
          Go Back
        </Button>
        <Button onClick={handleNext} className="bg-journal-maroon hover:bg-journal-maroon-dark">
          {confirmedOptions.doiEnabled ? "Confirm DOI Registration" : "Proceed Without DOI"}
        </Button>
      </DialogFooter>
    </>
  );

  const renderArchiveStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {confirmedOptions.internetArchiveEnabled ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          Internet Archive Preservation Confirmation
        </DialogTitle>
        <DialogDescription>
          {confirmedOptions.internetArchiveEnabled
            ? "You have selected to upload this article to the Internet Archive."
            : "You have chosen NOT to upload this article to the Internet Archive."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <p className="text-sm text-gray-700 mb-4">
          {confirmedOptions.internetArchiveEnabled
            ? "The article will be permanently preserved in the Internet Archive, ensuring long-term accessibility even if your server goes down."
            : "The article will NOT be preserved in the Internet Archive. You are responsible for ensuring long-term preservation."}
        </p>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel Publication
        </Button>
        <Button variant="outline" onClick={handleBack}>
          Go Back
        </Button>
        <Button onClick={handleNext} className="bg-journal-maroon hover:bg-journal-maroon-dark">
          {confirmedOptions.internetArchiveEnabled ? "Confirm Archive Upload" : "Proceed Without Archive"}
        </Button>
      </DialogFooter>
    </>
  );

  const renderEmailStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {confirmedOptions.emailNotificationEnabled ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          Email Notification Confirmation
        </DialogTitle>
        <DialogDescription>
          {confirmedOptions.emailNotificationEnabled
            ? "You have selected to notify subscribers about this publication."
            : "You have chosen NOT to notify subscribers about this publication."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <p className="text-sm text-gray-700 mb-4">
          {confirmedOptions.emailNotificationEnabled
            ? "All active subscribers will receive an email notification about this new article."
            : "Subscribers will NOT be notified about this article. They will need to discover it by visiting the journal website."}
        </p>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel Publication
        </Button>
        <Button variant="outline" onClick={handleBack}>
          Go Back
        </Button>
        <Button onClick={handleNext} className="bg-journal-maroon hover:bg-journal-maroon-dark">
          {confirmedOptions.emailNotificationEnabled ? "Confirm Email Notification" : "Proceed Without Notification"}
        </Button>
      </DialogFooter>
    </>
  );

  const renderFinalStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Final Publication Confirmation
        </DialogTitle>
        <DialogDescription>
          Please review all details before publishing this article.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Article Details</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Title:</strong> {articleDetails.title}</p>
            <p><strong>Author:</strong> {articleDetails.author}</p>
            <p><strong>Volume:</strong> {articleDetails.volume}, <strong>Issue:</strong> {articleDetails.issue}</p>
            <p><strong>Type:</strong> {articleDetails.articleType}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Publication Options</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>DOI Registration:</span>
              <span className={confirmedOptions.doiEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {confirmedOptions.doiEnabled ? "✓ Enabled" : "✗ Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Internet Archive:</span>
              <span className={confirmedOptions.internetArchiveEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {confirmedOptions.internetArchiveEnabled ? "✓ Enabled" : "✗ Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Notifications:</span>
              <span className={confirmedOptions.emailNotificationEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {confirmedOptions.emailNotificationEnabled ? "✓ Enabled" : "✗ Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Metadata Generation:</span>
              <span className="text-green-600 font-semibold">✓ Always Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This action cannot be undone. The article will be publicly accessible immediately after publication.
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel Publication
        </Button>
        <Button variant="outline" onClick={handleBack}>
          Go Back
        </Button>
        <Button onClick={handleConfirmFinal} className="bg-green-600 hover:bg-green-700">
          Confirm and Publish Article
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-2xl">
        {currentStep === 'doi' && renderDOIStep()}
        {currentStep === 'archive' && renderArchiveStep()}
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'final' && renderFinalStep()}
      </DialogContent>
    </Dialog>
  );
}