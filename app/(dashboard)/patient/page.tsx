"use client";

import PatientPortalHome from "@/components/Dashboard/Patient/PatientPortalHome";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["PATIENT"]}>
      <PatientPortalHome />
    </ProtectedRoute>
  );
}

// GHGGHHGHJJH?
