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
import Link from "next/link";

export default function HomePage({ jobs: initialJobs }: { jobs: Job[] }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { setShowLoginModal } = useModal();

  const [jobs] = useState<Job[]>(initialJobs);
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
      <div className="flex my-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center ">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-700 ">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          
        </ol>
      </div>
      <header className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center lg:text-left">
          Job Listings
        </h1>

        <div className="flex flex-wrap lg:justify-between justify-center gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
