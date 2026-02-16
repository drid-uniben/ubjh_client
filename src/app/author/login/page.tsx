"use client";

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2, LogIn, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError('');
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    try {
      await login(email, password);
      // Success handling is done in AuthContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login submission error:', err);
      // Error is set in context
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
                <Image
                  src="/uniben-logo.png"
                  alt="UNIBEN Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-journal-maroon tracking-tight">
                  UNIBEN Journal of Humanities
                </h1>
                <p className="text-sm text-gray-600">Author Portal</p>
              </div>
            </Link>
            <Link
              href="/"
              className="text-journal-maroon hover:text-journal-maroon-dark font-semibold text-sm"
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#fffbfb] px-8 py-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-10 w-10 text-journal-maroon" />
              </div>
              <h2 className="text-2xl font-bold text-journal-maroon mb-2">
                Author Login
              </h2>
              <p className="text-journal-maroon text-sm">
                Access your manuscript dashboard
              </p>
            </div>

            {/* Card Body */}
            <div className="px-8 py-8">
              {displayError && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-800 mb-1">
                        Login Failed
                      </h4>
                      <p className="text-sm text-red-600">{displayError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-journal-maroon focus:border-transparent transition-all text-gray-900"
                    placeholder="author@uniben.edu"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-journal-maroon focus:border-transparent transition-all text-gray-900"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-transparent rounded-lg text-base font-bold text-white bg-journal-maroon hover:bg-journal-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-journal-maroon disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Card Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm">
                <Link 
                  href="/" 
                  className="text-journal-maroon hover:text-journal-maroon-dark font-medium transition-colors"
                >
                  Homepage
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  href="/contact" 
                  className="text-journal-maroon hover:text-journal-maroon-dark font-medium transition-colors"
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Looking for a different portal?
            </p>
            <div className="mt-3 flex justify-center gap-4">
              <Link
                href="/reviewer/login"
                className="text-sm text-journal-maroon hover:text-journal-maroon-dark font-medium underline"
              >
                Reviewer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} University of Benin — UNIBEN Journal of Humanities. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
