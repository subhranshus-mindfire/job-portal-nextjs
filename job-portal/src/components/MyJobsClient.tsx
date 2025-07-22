"use client";

import Link from "next/link";
import { Job } from "@/types/types";
import { useModal } from "@/context/ModalContext";

export default function MyJobsClient({ jobs }: { jobs: Job[] }) {
  const { setShowJobModal } = useModal();

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto">
      <div className="flex my-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center ">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-700 "
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href="my-jobs"
                className="ms-1 text-sm font-medium text-gray-400 hover:text-gray-700"
              >
                My Jobs
              </Link>
            </div>
          </li>
        </ol>
      </div>
      <div className="flex justify-between">
        <h1 className="text-2xl sm:text-2xl font-bold mb-6">My Job Listings</h1>
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
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {job.job_role}
            </h2>
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
              Posted: {new Date(job.createdAt).toISOString().slice(0, 10)} 
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
