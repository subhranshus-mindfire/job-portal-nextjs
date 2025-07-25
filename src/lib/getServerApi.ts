import axios from "axios";
import { cookies } from "next/headers";

export function getServerApi() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return instance;
}
