"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!formData.username.trim() || !formData.password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      // Attempt login - updated for async function
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      <div className="w-full max-w-md bg-card shadow-lg rounded-xl border border-border/40 p-8 backdrop-blur-sm dark:bg-black/30 z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/atorix-logo.png"
              alt="Atorix IT Logo"
              width={150}
              height={60}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard Login</h1>
          <p className="text-muted-foreground mt-2">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Login Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username / Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your username or email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                Log In
                <LogIn className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        This area is restricted to authorized administrators only.
      </p>
    </div>
  );
}
