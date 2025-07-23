import MyJobsClient from "@/components/MyJobsClient";
import { getServerApi } from "@/lib/getServerApi";
import { Job } from "@/types/types";

export default async function MyJobsPage() {
  const api = getServerApi();

  let jobs: Job[] = [];

  try {
    const userRes = await api.get("/auth/me");
    const user = userRes.data;

    const res = await api.get(`/jobs/my/${user.role_id}`);
    jobs = res.data.data;
  } catch (error) {
    console.error(error);
  }

  return (<MyJobsClient jobs={jobs} />)
}
