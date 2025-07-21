"use client"

import { useState } from "react";
import api from "@/services/api";
import { useAlert } from "@/context/AlertContext";
import Link from "next/link";

interface Applicant {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  skills: string;
}

interface Application {
  _id: string;
  job: string;
  applicant: Applicant;
  status: string;
}

export default function ApplicantsClient({ initialApplications }: { initialApplications: Application[]; }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const { showAlert } = useAlert();

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${applicantId}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicantId
            ? { ...application, status: newStatus }
            : application
        )
      );
      showAlert("Status Updated", "success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-8 mx-auto max-w-6xl lg:max-w-none">
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
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <Link href={"/my-jobs"} className="ms-1 text-sm font-medium text-gray-400 hover:text-gray-700">My Jobs</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-400 hover:text-gray-700">Job ID</span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-400 hover:text-gray-700">Applicants</span>
            </div>
          </li>
        </ol>
      </div>
      <h1 className="text-2xl lg:text-2xl font-bold mb-6">Applicants</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-sm">No applicants yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded shadow p-4 flex flex-col gap-2"
            >
              <h2 className="text-lg font-semibold">{application.applicant.user.name}</h2>
              <p className="text-sm text-gray-600">{application.applicant.user.email}</p>
              <p className="text-sm text-gray-600">{application.applicant.user.phone}</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Skills:</span> {application.applicant.skills}
              </p>

              <div className="mt-2">
                <label className="text-sm font-medium block mb-1">Status:</label>
                <select
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(application._id, e.target.value)
                  }
                  className="border rounded px-2 py-1 w-full text-sm"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
