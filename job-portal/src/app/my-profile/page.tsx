import { getServerApi } from "@/lib/getServerApi";
import { redirect } from "next/navigation";
import MyProfileClient from "@/components/MyProfileClient";

export default async function ProfilePage() {
  const api = getServerApi();

  try {
    const res = await api.get("/auth/me");
    const user = res.data;

    if (!user) {
      redirect("/login");
    }

    return <MyProfileClient user={user} />;
  } catch (err) {
    console.error(err);
    redirect("/login");
  }
}
