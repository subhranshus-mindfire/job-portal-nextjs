
import ApplicantsClient from "@/components/ApplicantsClient";
import { getServerApi } from "@/lib/getServerApi";

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

type Params = Promise<{ params: {id: string }}>

export default async function ApplicantsPage(props: { params: Params }) {
  const params = await props.params;
  const jobId = params.params.id;
  const api = getServerApi();
  const res = await api.get(`/jobs/${jobId}/applicants`);
  const applications: Application[] = res.data.data;
  return <ApplicantsClient initialApplications={applications} />;
}