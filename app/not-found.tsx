"use client"; // Mark the not-found page as a Client Component

import { Suspense } from "react";
import EmptyState from "@/app/components/EmptyState";
import Loader from "./components/Loader";

export default function NotFound() {
  return (
    <Suspense fallback={<Loader />}>
      <EmptyState
        title="404 - Page Not Found"
        subtitle="The page you're looking for doesn't exist."
      />
    </Suspense>
  );
}