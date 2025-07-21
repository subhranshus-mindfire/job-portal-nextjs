export interface Job {
  _id: number;
  job_role: string;
  description: string;
  job_type: "Hybrid" | "Remote" | "OnSite";
  location: string;
  createdAt: string;
  updatedAt: string;
  employer: Employer;
  applicants?: object[];
}

export interface Employer {
  user: User;
  _id: string;
}

export interface User {
  name: string;
  _id: string;
}

export interface Applicant {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  skills: string;
}

export interface Application {
  _id: string;
  applicant?: Applicant;
  status: "interview" | "hired" | "rejected" | "applied";
  job: Job;
}

