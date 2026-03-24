"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Supabase Signup Network Request
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#030712] text-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]">
        <Card className="w-full max-w-md bg-gray-900/40 border border-gray-800/60 rounded-3xl backdrop-blur-xl text-center shadow-2xl shadow-emerald-500/10">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold mb-3 text-white">Check your email</CardTitle>
            <CardDescription className="text-gray-400 mb-8 max-w-sm">We've sent a magic link to {email}. Click the link to complete your account setup and download the app.</CardDescription>
            <Link href="/" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors">
              Return home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]">
      
      <Card className="w-full max-w-md bg-gray-900/40 border border-gray-800/60 rounded-3xl backdrop-blur-xl shadow-2xl shadow-indigo-500/10 text-white">
        <CardHeader className="flex flex-col items-center pb-4 pt-10">
          <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl tracking-tighter mb-4 shadow-lg shadow-indigo-500/20">B</Link>
          <CardTitle className="text-2xl font-bold">Join Bartr</CardTitle>
          <CardDescription className="text-gray-400 mt-2">Start trading skills with your community</CardDescription>
        </CardHeader>

        <CardContent className="px-8 sm:px-10 pb-10">
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all text-white placeholder:text-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none transition-all text-white placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
