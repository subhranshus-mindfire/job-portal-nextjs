import React from "react";
import type { Job } from "../types/types"
import Image from "next/image";

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onView }) => {
  const companyName = job.employer?.user.name.replace(/\s+/g, "").toLowerCase();
  const logoUrl = `https://img.logo.dev/${companyName}.com?token=pk_U5pZvgj7Ty2ZWkob2YkBig`;

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-md transition flex flex-col gap-2 hover:scale-105 hover:cursor-pointer duration-200" onClick={() => onView(job)}>
      <div className="absolute top-4 right-4">
        <Image
          src={logoUrl}
          alt={job.employer?.user.name}
          className="w-10 h-10 object-contain rounded-full"
          width={100} height={100}
        />
      </div>

      <h2 className="text-lg lg:text-xl font-bold">{job.job_role}</h2>
      <h3 className="text-base lg:text-lg font-semibold text-gray-600">{job.employer?.user.name}</h3>

      <p className="text-gray-600 text-sm lg:text-base">
        <i className="fa-solid fa-location-dot mr-1"></i>
        {job.location ? job.location : "Remote"}
      </p>

      <p className="text-gray-700 text-sm lg:text-base overflow-hidden text-ellipsis line-clamp-3 hidden lg:block">
        {job.description.slice(0, 120)}...
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-2">
        <p className="text-sm text-gray-500">
          Posted on {new Date(job.createdAt).toISOString().slice(0, 10)}
        </p>

      </div>
    </div>
  );
};

export default JobCard;
