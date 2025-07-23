import HomePage from "../components/HomePage";
import api from "@/services/api";
import { Job } from "@/types/types";

export default async function Home() {
  const res = await api.get("/jobs");
  const jobs: Job[] = res.data.data;

  return <HomePage jobs={jobs} />;
}
