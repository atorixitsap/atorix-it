"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Trash2,
  Download, // Use Download instead of FileExport
  Search,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import {
  fetchFormSubmissions,
  deleteFormSubmission,
  deleteBulkFormSubmissions,
  exportToExcel,
} from "@/lib/api";
import { logout } from "@/lib/auth";

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const router = useRouter();

  // Fetch form submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFormSubmissions();

      if (result.success) {
        setSubmissions(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to fetch submissions. Please try again.");
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle select/deselect all submissions
  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      // Deselect all
      setSelectedSubmissions([]);
    } else {
      // Select all
      setSelectedSubmissions(
        filteredSubmissions.map((sub) => sub._id || sub.id)
      );
    }
  };

  // Handle select/deselect single submission
  const handleSelectSubmission = (id) => {
    if (selectedSubmissions.includes(id)) {
      // Deselect
      setSelectedSubmissions((prev) => prev.filter((subId) => subId !== id));
    } else {
      // Select
      setSelectedSubmissions((prev) => [...prev, id]);
    }
  };

  // Handle delete single submission
  const handleDeleteSubmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const result = await deleteFormSubmission(id);

      if (result.success) {
        // Remove from state
        setSubmissions((prev) =>
          prev.filter((sub) => (sub._id || sub.id) !== id)
        );

        // Remove from selected
        setSelectedSubmissions((prev) => prev.filter((subId) => subId !== id));

        // Show success message
        showAlertMessage("success", "Submission deleted successfully");
      } else {
        showAlertMessage(
          "error",
          result.error || "Failed to delete submission"
        );
      }
    } catch (error) {
      showAlertMessage("error", "An error occurred. Please try again.");
      console.error("Delete error:", error);
    }
  };

  // Handle delete bulk submissions
  const handleDeleteBulk = async () => {
    if (selectedSubmissions.length === 0) {
      showAlertMessage("error", "No submissions selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedSubmissions.length} submissions?`
      )
    ) {
      return;
    }

    try {
      const result = await deleteBulkFormSubmissions(selectedSubmissions);

      if (result.success) {
        // Remove from state
        setSubmissions((prev) =>
          prev.filter((sub) => !selectedSubmissions.includes(sub._id || sub.id))
        );

        // Clear selected
        setSelectedSubmissions([]);

        // Show success message
        showAlertMessage("success", result.message);
      } else {
        showAlertMessage(
          "error",
          result.error || "Failed to delete submissions"
        );
      }
    } catch (error) {
      showAlertMessage("error", "An error occurred. Please try again.");
      console.error("Bulk delete error:", error);
    }
  };

  // Handle export to Excel
  const handleExport = () => {
    try {
      // Get submissions to export (either selected or all filtered)
      const dataToExport =
        selectedSubmissions.length > 0
          ? submissions.filter((sub) =>
              selectedSubmissions.includes(sub._id || sub.id)
            )
          : filteredSubmissions;

      if (dataToExport.length === 0) {
        showAlertMessage("error", "No data to export");
        return;
      }

      // Create Excel file
      const excelBlob = exportToExcel(dataToExport);

      // Create download link
      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `atorix_submissions_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showAlertMessage(
        "success",
        `Exported ${dataToExport.length} submissions successfully`
      );
    } catch (error) {
      showAlertMessage("error", "Failed to export data");
      console.error("Export error:", error);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New field
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Show alert message
  const showAlertMessage = (type, message) => {
    setAlertMessage({ type, message });
    setShowAlert(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Filter submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      // First apply form type filter
      if (filterType !== "all") {
        if (!sub.formType) return false;
        return sub.formType === filterType;
      }
      return true;
    })
    .filter((sub) => {
      // Then apply search term
      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();

      // Search in multiple fields
      return (
        (sub.name && sub.name.toLowerCase().includes(searchTermLower)) ||
        (sub.email && sub.email.toLowerCase().includes(searchTermLower)) ||
        (sub.company && sub.company.toLowerCase().includes(searchTermLower)) ||
        (sub.phone && sub.phone.toLowerCase().includes(searchTermLower))
      );
    })
    .sort((a, b) => {
      // Sort based on field and direction
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle dates
      if (sortField === "createdAt") {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      }

      // Handle strings
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Handle undefined/null
      if (valueA === undefined || valueA === null) valueA = "";
      if (valueB === undefined || valueB === null) valueB = "";

      // Compare based on direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Determine form type
  const getFormType = (submission) => {
    // Try to determine form type based on fields
    if (submission.interests || submission.interestedIn) {
      return "Demo Request";
    } else if (submission.role) {
      return "Demo Request";
    } else {
      return "Contact Form";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Dashboard Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/atorix-logo.png"
                alt="Atorix IT Logo"
                width={120}
                height={48}
                priority
              />
              <h1 className="text-xl md:text-2xl font-bold hidden sm:block">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Alert Message */}
          {showAlert && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start justify-between ${
                alertMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              <div className="flex items-start">
                {alertMessage.type === "success" ? (
                  <CheckSquare className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <p>{alertMessage.message}</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Form Submissions</h2>
            <p className="text-muted-foreground">
              Manage and view all form submissions from your website.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 rounded-md border border-input w-full sm:w-[280px] bg-background"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-md border border-input bg-background"
              >
                <option value="all">All Forms</option>
                <option value="contact">Contact Forms</option>
                <option value="demo">Demo Requests</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={fetchSubmissions}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleExport}
                disabled={submissions.length === 0}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={handleDeleteBulk}
                disabled={selectedSubmissions.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                <p className="text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={fetchSubmissions}
                >
                  Try Again
                </Button>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No submissions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedSubmissions.length ===
                                filteredSubmissions.length &&
                              filteredSubmissions.length > 0
                            }
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                      </th>

                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center text-sm font-medium"
                          onClick={() => handleSort("name")}
                        >
                          Name
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center text-sm font-medium"
                          onClick={() => handleSort("email")}
                        >
                          Email
                          {sortField === "email" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        <button
                          className="flex items-center text-sm font-medium"
                          onClick={() => handleSort("phone")}
                        >
                          Phone
                          {sortField === "phone" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left hidden lg:table-cell">
                        <button
                          className="flex items-center text-sm font-medium"
                          onClick={() => handleSort("company")}
                        >
                          Company
                          {sortField === "company" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left hidden xl:table-cell">
                        Form Type
                      </th>

                      <th className="px-4 py-3 text-left">
                        <button
                          className="flex items-center text-sm font-medium"
                          onClick={() => handleSort("createdAt")}
                        >
                          Date
                          {sortField === "createdAt" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            ))}
                        </button>
                      </th>

                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredSubmissions.map((submission) => {
                      const id = submission._id || submission.id;
                      return (
                        <tr key={id} className="hover:bg-muted/50">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.includes(id)}
                              onChange={() => handleSelectSubmission(id)}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                          </td>

                          <td className="px-4 py-4 font-medium">
                            {submission.name || "N/A"}
                          </td>

                          <td className="px-4 py-4">
                            {submission.email || "N/A"}
                          </td>

                          <td className="px-4 py-4 hidden md:table-cell">
                            {submission.phone || "N/A"}
                          </td>

                          <td className="px-4 py-4 hidden lg:table-cell">
                            {submission.company || "N/A"}
                          </td>

                          <td className="px-4 py-4 hidden xl:table-cell">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getFormType(submission) === "Demo Request"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {getFormType(submission)}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {formatDate(
                              submission.createdAt || submission.date
                            )}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubmission(id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination/Stats */}
          <div className="mt-4 text-sm text-muted-foreground flex justify-between items-center">
            <p>
              {filteredSubmissions.length} results
              {searchTerm && ` for "${searchTerm}"`}
              {filterType !== "all" &&
                ` in ${filterType === "contact" ? "Contact Forms" : "Demo Requests"}`}
            </p>

            <p>
              {selectedSubmissions.length > 0 &&
                `${selectedSubmissions.length} selected`}
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
