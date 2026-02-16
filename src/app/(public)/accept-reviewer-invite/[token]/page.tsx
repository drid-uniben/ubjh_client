"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { completeReviewerProfile } from '@/services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const reviewerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  faculty: z.string().min(1, "Faculty/Department is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  phoneNumber: z.string().optional(),
  areaOfSpecialization: z.string().optional(),
});

interface ReviewerRegisterPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function ReviewerRegisterPage({ params }: ReviewerRegisterPageProps) {
  const { token } = use(params);
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [areaOfSpecialization, setAreaOfSpecialization] = useState("");
  
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    try {
      reviewerProfileSchema.parse({ 
        name, 
        faculty, 
        affiliation,
        phoneNumber,
        areaOfSpecialization, 
      });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        name,
        faculty,
        affiliation,
        phoneNumber,
        areaOfSpecialization,
      };

      await completeReviewerProfile(token, profileData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/reviewer/login");
      }, 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message || "Failed to complete registration");
      } else if (error instanceof Error) {
        setError(error.message || "Failed to complete registration");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-800">
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Your reviewer profile has been successfully created. Your login credentials
              have been sent to your email.
            </p>
            <p>You will be redirected to the login page shortly...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-journal-maroon">
            Complete Reviewer Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your information to complete your reviewer registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={validationErrors.name ? "border-red-500" : ""}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="faculty" className="text-sm font-medium">
                Faculty/Department *
              </label>
              <Input
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className={validationErrors.faculty ? "border-red-500" : ""}
                placeholder="e.g., Faculty of Science, Computer Science"
                required
              />
              {validationErrors.faculty && (
                <p className="text-sm text-red-500">{validationErrors.faculty}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="affiliation" className="text-sm font-medium">
                Affiliation *
              </label>
              <Textarea
                id="affiliation"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className={validationErrors.affiliation ? "border-red-500" : ""}
                placeholder="e.g., University of Benin"
                rows={2}
                required
              />
              {validationErrors.affiliation && (
                <p className="text-sm text-red-500">{validationErrors.affiliation}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number (Optional)
              </label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +2348012345678"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="areaOfSpecialization" className="text-sm font-medium">
                Area of Specialization (Optional)
              </label>
              <Input
                id="areaOfSpecialization"
                value={areaOfSpecialization}
                onChange={(e) => setAreaOfSpecialization(e.target.value)}
                placeholder="e.g., Artificial Intelligence, African History"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-journal-maroon hover:bg-journal-maroon-dark" 
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            After registration, you&apos;ll receive your login credentials via email
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}