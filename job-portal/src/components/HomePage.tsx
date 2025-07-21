"use client";

import React, { useState } from "react";
import JobCard from "@/components/JobCard";
import JobDetailsModal from "@/components/JobDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { useModal } from "@/context/ModalContext";
import type { Job } from "@/types/types";
import type { AxiosError } from "axios";
import api from "@/services/api";

export default function HomePage({ jobs: initialJobs }: { jobs: Job[] }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { setShowLoginModal } = useModal();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [sortBy, setSortBy] = useState<
    "date_desc" | "date_asc" | "title_asc" | "title_desc"
  >("date_desc");
  const [filterType, setFilterType] = useState<Job["job_type"] | "">("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value as typeof sortBy);

  const handleFilter = (type: Job["job_type"]) =>
    setFilterType(type === filterType ? "" : type);

  const handleApply = async () => {
    if (!selectedJob || !user) return;
    try {
      await api.post(`/applications`, {
        applicant: user.role_id,
        job: selectedJob._id,
        status: "applied",
      });
      showAlert("Applied successfully!", "success");
      setSelectedJob(null);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      showAlert(error.response?.data?.message || "Something went wrong.", "error");
    }
  };

  const filteredJobs = jobs
    .filter((job) => (filterType ? job.job_type === filterType : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.job_role.localeCompare(b.job_role);
        case "title_desc":
          return b.job_role.localeCompare(a.job_role);
        case "date_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date_desc":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen flex flex-col p-4">
      <header className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold text-center md:text-left">
          Job Listings
        </h1>

        <div className="flex flex-wrap md:justify-between justify-center gap-2">
          <div className="flex gap-2">
            {["Hybrid", "Remote", "OnSite"].map((type) => (
              <button
                key={type}
                className={`px-3 py-0.5 text-base rounded-full border ${filterType === type
                  ? "bg-gray-600 text-white border-gray-600"
                  : "border-gray-400 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => handleFilter(type as Job["job_type"])}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={handleSort}
            className="p-2 rounded"
          >
            <option value="date_desc">Sort By Date (Newest First)</option>
            <option value="date_asc">Sort By Date (Oldest First)</option>
            <option value="title_asc">Sort By Title (A-Z)</option>
            <option value="title_desc">Sort By Title (Z-A)</option>
          </select>
        </div>
      </header>

      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onView={(job) => setSelectedJob(job)}
            />
          ))}
        </div>
      </main>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          canApply={!!user && user.role !== "employer"}
          setShowLoginModal={setShowLoginModal}
        />
      )}
    </div>
  );
}
