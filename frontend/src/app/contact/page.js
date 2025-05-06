"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { submitFormData, normalizeFormData } from "@/lib/api";

// Animated floating shapes for contact page background
function FloatingShapes() {
  const shapes = [
    // Circles
    { type: "circle", size: 70, color: "bg-blue-500/10" },
    { type: "circle", size: 50, color: "bg-indigo-500/10" },
    { type: "circle", size: 90, color: "bg-primary/10" },
    { type: "circle", size: 40, color: "bg-violet-500/10" },
    { type: "circle", size: 60, color: "bg-blue-600/10" },

    // Squares
    { type: "square", size: 60, color: "bg-indigo-400/10" },
    { type: "square", size: 40, color: "bg-primary/10" },
    { type: "square", size: 80, color: "bg-blue-500/10" },

    // Triangles (using pseudo before/after elements)
    { type: "triangle", size: 60, color: "bg-transparent border-primary/10" },
    {
      type: "triangle",
      size: 80,
      color: "bg-transparent border-indigo-500/10",
    },
    { type: "triangle", size: 40, color: "bg-transparent border-blue-400/10" },
  ];

  // Fixed positions for SSR compatibility
  const positions = [
    { x: 5, y: 15 },
    { x: 20, y: 80 },
    { x: 25, y: 30 },
    { x: 40, y: 60 },
    { x: 60, y: 20 },
    { x: 75, y: 65 },
    { x: 80, y: 35 },
    { x: 90, y: 70 },
    { x: 15, y: 45 },
    { x: 65, y: 85 },
    { x: 95, y: 5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => {
        const pos = positions[i % positions.length];
        const duration = 30 + (i % 15);
        const delay = i * 2;

        if (shape.type === "circle") {
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full ${shape.color} blur-lg`}
              style={{
                width: shape.size,
                height: shape.size,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        } else if (shape.type === "square") {
          return (
            <motion.div
              key={i}
              className={`absolute rounded-lg ${shape.color} blur-lg`}
              style={{
                width: shape.size,
                height: shape.size,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                x: [0, -60, 60, 0],
                y: [0, 60, -60, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        } else {
          // Triangle using a rotated element with borders
          return (
            <motion.div
              key={i}
              className={`absolute ${shape.color}`}
              style={{
                width: 0,
                height: 0,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid rgba(99, 102, 241, 0.1)`,
                filter: "blur(8px)",
              }}
              animate={{
                x: [0, 40, -40, 0],
                y: [0, -40, 40, 0],
                rotate: [0, 120, 240, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        }
      })}
    </div>
  );
}

// Pulsing circles for map section
function PulsingMapDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* India location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "68%", top: "56%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* US location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "25%", top: "40%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      />

      {/* Germany location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "50%", top: "35%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
      />
    </div>
  );
}

// Card hover effects for FAQ section
function EnhancedFAQCard({ title, content, delay = 0 }) {
  return (
    <motion.div
      className="bg-card rounded-lg p-6 border border-border/40 hover:border-primary/30 transition-all duration-300"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
        y: -5,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground">{content}</p>
    </motion.div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional field)
    if (formData.phone && !/^[+\d\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Clear API error when user makes any changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
      });

      // Submit the normalized data to the API
      const result = await submitFormData(normalizedData);

      if (result.success) {
        setSubmitted(true);
        // Reset form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });

        // Reset submitted state after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
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
    <>
      {/* Progress bar that shows scroll position */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section with animated background */}
      <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <FloatingShapes />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Contact Us
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Get in Touch with Our SAP Experts
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Have questions about our SAP services or want to discuss your
              project? Our team is ready to help you find the perfect solution
              for your business needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Contact Information */}
            <motion.div
              className="lg:col-span-1 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Feel free to reach out to us using any of the contact methods
                  below. We'll get back to you as quickly as possible.
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start p-4 rounded-lg bg-background hover:bg-muted/20 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-primary/10 mr-4"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "var(--primary-20)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1">Our Office</h3>
                    <p className="text-muted-foreground">
                      3rd Floor, Office No. C 305 DP Road, Police, Wireless
                      Colony, Pune, Maharashtra.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-4 rounded-lg bg-background hover:bg-muted/20 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-primary/10 mr-4"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "var(--primary-20)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a
                      href="mailto:info@atorix.in"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      info@atorix.in
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">
                      For general inquiries
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-4 rounded-lg bg-background hover:bg-muted/20 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-primary/10 mr-4"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "var(--primary-20)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <a
                      href="tel:+918956001555"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      +91 89560 01555
                    </a>
                    <p className="text-muted-foreground text-sm mt-1">
                      Mon-Sat from 9:30am to 6:30pm
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start p-4 rounded-lg bg-background hover:bg-muted/20 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-primary/10 mr-4"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "var(--primary-20)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Clock className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Saturday: 9:30 AM - 6:30 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <motion.div
                className="bg-card rounded-xl shadow-lg border border-border/40 p-8 backdrop-blur-sm dark:bg-black/30"
                whileHover={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                {submitted ? (
                  <motion.div
                    className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="font-medium">Thank you for your message!</p>
                      <p className="text-sm mt-1">
                        We have received your inquiry and will get back to you
                        shortly.
                      </p>
                    </div>
                  </motion.div>
                ) : null}

                {apiError && (
                  <motion.div
                    className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-6 rounded-lg mb-6 flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="rounded-full bg-red-100 dark:bg-red-800 p-1 mr-3 flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                    </div>
                    <div>
                      <p className="font-medium">Error Submitting Form</p>
                      <p className="text-sm mt-1">{apiError}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={errors.name ? "true" : "false"}
                        className={
                          "w-full px-4 py-2 rounded-md border " +
                          (errors.name
                            ? "border-red-500 dark:border-red-400"
                            : "border-input") +
                          " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                        }
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={errors.email ? "true" : "false"}
                        className={
                          "w-full px-4 py-2 rounded-md border " +
                          (errors.email
                            ? "border-red-500 dark:border-red-400"
                            : "border-input") +
                          " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                        }
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    >
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={errors.phone ? "true" : "false"}
                        className={
                          "w-full px-4 py-2 rounded-md border " +
                          (errors.phone
                            ? "border-red-500 dark:border-red-400"
                            : "border-input") +
                          " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                        }
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                    >
                      <label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Enter your company name"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                  >
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={errors.message ? "true" : "false"}
                      className={
                        "w-full px-4 py-2 rounded-md border " +
                        (errors.message
                          ? "border-red-500 dark:border-red-400"
                          : "border-input") +
                        " bg-background focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      }
                      placeholder="Tell us about your project or inquiry"
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        {errors.message}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                  >
                    <Button
                      type="submit"
                      className="w-full sm:w-auto gap-2"
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
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>
        <PulsingMapDots />

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold">Our Location</h2>
            <p className="text-muted-foreground mt-2">Find us on the map</p>
          </motion.div>

          <motion.div
            className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-border/40"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <iframe
              src="https://www.google.com/maps?q=18.588048051275003,73.78119014757031&hl=es;z=14&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Atorix IT Solutions Location"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Here are some common questions about our services. If you don't
              find what you're looking for, feel free to contact us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <EnhancedFAQCard
              title="What SAP services do you offer?"
              content="We offer a full range of SAP services including implementation, support, integration, migration, upgrade, and specialized consulting for specific industries."
              delay={0.1}
            />

            <EnhancedFAQCard
              title="How long does an SAP implementation take?"
              content="Implementation timelines vary based on project scope, but typically range from 3-12 months. We use accelerated methodologies to minimize disruption."
              delay={0.2}
            />

            <EnhancedFAQCard
              title="Do you provide post-implementation support?"
              content="Yes, we offer comprehensive post-implementation support services to ensure your SAP systems continue to run smoothly and efficiently."
              delay={0.3}
            />

            <EnhancedFAQCard
              title="What industries do you specialize in?"
              content="We have expertise across multiple industries including manufacturing, healthcare, retail, finance, energy, and more. Our solutions are tailored to specific industry needs."
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </>
  );
}
