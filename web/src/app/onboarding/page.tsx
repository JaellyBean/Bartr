"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Onboarding() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bio.trim() || !skills.trim()) {
      setError("Please add a short bio and at least one skill.");
      return;
    }

    setIsLoading(true);

    // In a fully integrated implementation, we would update the Supabase 'profiles' table here.
    // Simulating network request for the UI implementation state.
    setTimeout(() => {
      setIsLoading(false);
      router.push("/"); // Redirect to home page after onboarding
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#030712] to-[#030712]">
      <Card className="w-full max-w-md bg-gray-900/40 border border-gray-800/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 text-white">
        <CardHeader className="flex flex-col items-center pb-4 pt-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-bold text-xl tracking-tighter mb-4 shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <CardTitle className="text-2xl font-bold">
            Complete your profile
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2 text-center">
            Let the community know what you have to offer.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 sm:px-10 pb-10">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Short Bio
              </label>
              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl outline-none transition-all text-white placeholder:text-gray-600 resize-none min-h-[100px]"
                placeholder="I'm a local mechanic who loves fixing up vintage cars..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Your Skills (comma separated)
              </label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl outline-none transition-all text-white placeholder:text-gray-600"
                placeholder="Graphic Design, Plumbing, Tutoring"
              />
            </div>

            {error ? (
              <p className="text-red-400 text-sm text-center font-medium mt-2">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Saving Profile..." : "Finish Setup"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
