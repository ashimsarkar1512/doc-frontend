"use client";

import { useGetCurrentUserQuery } from "@/Redux/api/authApi";
import { useAppSelector } from "@/Redux/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [hydrated, setHydrated] = useState(false);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Wait for hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

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
  }, [token, isLoading, currentUser, allowedRoles, router, hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
      </div>
    );
  }

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
