"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { Job } from "@/types/types";
import { useModal } from "@/context/ModalContext";

export default function MyJobsClient() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { setShowJobModal } = useModal()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user?.role_id) return;

        const res = await api.get(`/jobs/my/${user.role_id}`);
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.role_id]);

  if (loading) return <p className="p-8">Loading jobs...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 mx-auto max-w-7xl">
      <div className="flex justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Job Listings</h1>
        <button
          onClick={() => setShowJobModal(true)}
          className="bg-gray-600 h-fit text-white py-2.5 px-4 rounded-full cursor-pointer text-base transition hover:scale-105"
        >
          Add New Job
        </button>
      </div>

      {jobs.length === 0 && (
        <p className="text-gray-600">You have not posted any jobs yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{job.job_role}</h2>
            <p className="text-gray-600 mb-3 text-sm">
              {job.description.slice(0, 100)}...
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Type: {job.job_type}
            </p>
            {job.location && job.job_type !== "Remote" && (
              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                Location: {job.location}
              </p>
            )}
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Posted: {new Date(job.createdAt).toLocaleDateString()}
            </p>
            <Link
              href={`/jobs/${job._id}/applicants`}
              className="text-gray-600 font-semibold hover:underline text-sm"
            >
              Applicants: {job?.applicants?.length}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
