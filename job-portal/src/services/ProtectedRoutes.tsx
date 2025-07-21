import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "employer" | "applicant";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter()

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(user, !user)
  if (!user) {
    router.push("unauthenticated")
    return
  }

  if (role && user.role !== role) {
    router.push("unauthorized")
    return
  }

  return <>{children}</>;
}
