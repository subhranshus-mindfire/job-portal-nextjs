import MyApplicationsClient from "@/components/MyApplicationsClient";
import { redirect } from "next/navigation";
import { Application } from "@/types/types";
import { getServerApi } from "@/lib/getServerApi";

export default async function MyApplicationsPage() {
  const api = getServerApi();

  let applications: Application[] = [];

  try {
    const userRes = await api.get("/auth/me");
    const user = userRes.data;


    const res = await api.get(`/applications/applicant/${user.role_id}`);
    applications = res.data.data;
  } catch (error) {
    console.error(error);
  }

  return <MyApplicationsClient applications={applications} />;
}
