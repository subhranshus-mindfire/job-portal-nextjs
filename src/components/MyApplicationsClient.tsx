"use client";

import Link from "next/link";
import Image from "next/image";
import type { Application } from "@/types/types";
import ProtectedRoute from "@/services/ProtectedRoutes";

export default function MyApplicationsClient({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <ProtectedRoute role="applicant">
      <div className="p-4 lg:p-8">
        <div className="flex my-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center ">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-700 "
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
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
                  href="/my-applications"
                  className="ms-1 text-sm font-medium text-gray-400 hover:text-gray-700"
                >
                  My Applications
                </Link>
              </div>
            </li>
          </ol>
        </div>

        <h1 className="text-2xl font-bold mb-6">My Applications</h1>

        {applications.length === 0 && (
          <p className="text-gray-600">You have not applied to any jobs yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const employerName =
              app.job.employer?.user?.name?.replace(/\s+/g, "").toLowerCase() ||
              "company";
            const logoUrl = `https://img.logo.dev/${employerName}.com?token=pk_U5pZvgj7Ty2ZWkob2YkBig`;

            let statusClass = "";
            if (app.status === "interview") {
              statusClass = "bg-yellow-200 text-yellow-800";
            } else if (app.status === "hired") {
              statusClass = "bg-green-200 text-green-800";
            } else if (app.status === "rejected") {
              statusClass = "bg-red-200 text-red-800";
            } else if (app.status === "applied") {
              statusClass = "bg-gray-200 text-black";
            }

            return (
              <div
                key={app._id}
                className="relative bg-white p-6 rounded shadow hover:shadow-md transition"
              >
                <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <Image
                  src={logoUrl}
                  alt="Company Logo"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full object-cover"
                  width={40}
                  height={40}
                />

                <h2 className="text-xl font-semibold mb-2">
                  {app.job.job_role}
                </h2>
                <p className="text-gray-600 mb-2">
                  {app.job.description.slice(0, 100)}...
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Type: {app.job.job_type}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Location:{" "}
                  {app.job.job_type === "Remote"
                    ? "Remote"
                    : app.job.location}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
