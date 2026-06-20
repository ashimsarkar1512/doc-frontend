"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/store/hooks";
import { useGetCurrentUserQuery } from "@/Redux/api/authApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!isLoading && currentUser && allowedRoles?.length) {
      const userRole = currentUser.data?.role;
      if (userRole && !allowedRoles.includes(userRole)) {
        router.push("/");
      }
    }
  }, [token, isLoading, currentUser, allowedRoles, router]);

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
