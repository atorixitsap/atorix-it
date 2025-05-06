"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { submitFormData, normalizeFormData } from "@/lib/api";

export default function CtaSection() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Animation for lightning/particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];

    // Set canvas to full section size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Create initial particles
      createParticles();
    };

    // Particle creation
    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.floor(canvas.width * canvas.height / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Company is optional

    // Message is optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error for this field
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus the first field with an error
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // Normalize the form data to match the backend API's expected structure
      const normalizedData = normalizeFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      });

      // Submit the normalized data to the API
      const result = await submitFormData(normalizedData);

      if (result.success) {
        setSubmitted(true);

        // Reset form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          message: "",
        });

        // Reset submitted state after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        // Handle API error
        setApiError(result.error);
      }
    } catch (error) {
      // Handle unexpected error
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-blue-900 opacity-90 dark:opacity-80"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Animated canvas for particles/lightning effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business with SAP?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Our team of SAP experts is ready to help you implement, optimize, or migrate
              your SAP systems for maximum efficiency and ROI.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Customized SAP solutions tailored to your specific industry and business needs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Expert team with deep SAP knowledge and implementation experience</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-white mr-3 flex-shrink-0" />
                <p className="text-white/90">Comprehensive support and maintenance services to keep your systems running smoothly</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-700 hover:bg-white/90 border-0"
              >
                <Link href="/contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-blue-700 text-white hover:bg-white/10"
              >
                <Link href="/get-demo" className="flex text-white bg-blue-700 items-center hover:text-white">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Get a Demo
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="bg-white dark:bg-background rounded-xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Get in Touch with Our Team
            </h3>

            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 flex items-start">
                <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm mt-1">
                    We have received your inquiry and will get back to you shortly.
                  </p>
                </div>
              </div>
            ) : null}

            {apiError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error Submitting Form</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-invalid={errors.firstName ? "true" : "false"}
                    className={
                      "w-full px-4 py-2 rounded-md border " +
                      (errors.firstName ? "border-red-500 dark:border-red-400" : "border-input") +
                      " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                    }
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-invalid={errors.lastName ? "true" : "false"}
                    className={
                      "w-full px-4 py-2 rounded-md border " +
                      (errors.lastName ? "border-red-500 dark:border-red-400" : "border-input") +
                      " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                    }
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                  className={
                    "w-full px-4 py-2 rounded-md border " +
                    (errors.email ? "border-red-500 dark:border-red-400" : "border-input") +
                    " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                  }
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Tell us about your requirements"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
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
                  "Submit"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
