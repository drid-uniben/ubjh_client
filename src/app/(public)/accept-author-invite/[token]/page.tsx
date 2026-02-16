'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { completeAuthorProfile } from '@/services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

const authorProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  faculty: z.string().min(1, 'Faculty/Department is required'),
  affiliation: z.string().min(1, 'Affiliation is required'),
  orcid: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Invalid ORCID format'),
});

interface AuthorRegisterPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function AuthorRegisterPage({ params }: AuthorRegisterPageProps) {
  const { token } = use(params);
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [orcid, setOrcid] = useState('');

  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    try {
      authorProfileSchema.parse({
        name,
        faculty,
        affiliation,
        orcid,
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
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        name,
        faculty,
        affiliation,
        orcid,
      };

      await completeAuthorProfile(token, profileData);
      setSuccess(true);

      setTimeout(() => {
        router.push('/author/login');
      }, 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message || 'Failed to complete registration');
      } else if (error instanceof Error) {
        setError(error.message || 'Failed to complete registration');
      } else {
        setError('An unknown error occurred');
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
            <CardTitle className="text-2xl font-bold text-center text-journal-maroon">
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="mb-4">
              Your author profile has been successfully created. Your login credentials have been sent to your email.
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
            Complete Author Profile
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your information to complete your author registration
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
                className={validationErrors.name ? 'border-red-500' : ''}
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
                className={validationErrors.faculty ? 'border-red-500' : ''}
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
                className={validationErrors.affiliation ? 'border-red-500' : ''}
                placeholder="e.g., University of Benin"
                rows={2}
                required
              />
              {validationErrors.affiliation && (
                <p className="text-sm text-red-500">{validationErrors.affiliation}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="orcid" className="text-sm font-medium">
                ORCID *
              </label>
              <Input
                id="orcid"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                className={validationErrors.orcid ? 'border-red-500' : ''}
                placeholder="0000-0000-0000-0000"
                required
              />
              {validationErrors.orcid && (
                <p className="text-sm text-red-500">{validationErrors.orcid}</p>
              )}
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

            <Button
              type="submit"
              className="w-full bg-journal-maroon hover:bg-journal-maroon-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Complete Registration'}
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
