"use client";

import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import { useAuth } from "./authContext";
import Home from "./Home";
import Login from "./login/page";

interface PageProps {
  params: Promise<{ [key: string]: any }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PageContent: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Memoize the component to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (isLoggedIn) {
      return <Home />;
    }
    return <Login />;
  }, [isLoggedIn]);

  return content;
};

const Page: React.FC<PageProps> = ({ params, searchParams }) => {
  const [resolvedParams, setResolvedParams] = useState<{
    [key: string]: any;
  } | null>(null);
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{
    [key: string]: string | string[] | undefined;
  } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParamsData = await params;
        const resolvedSearchParamsData = await searchParams;
        setResolvedParams(resolvedParamsData);
        setResolvedSearchParams(resolvedSearchParamsData);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error resolving params:", error);
        }
        setResolvedParams({});
        setResolvedSearchParams({});
      }
    };
    resolveParams();
  }, [params, searchParams]);

  // Memoize the loading state check
  const isLoading = useMemo(() => {
    return !resolvedParams || !resolvedSearchParams;
  }, [resolvedParams, resolvedSearchParams]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 bg-white dark:bg-slate-900 rounded-xl shadow-md flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 bg-white dark:bg-slate-900 rounded-xl shadow-md min-h-[60vh]">
      <Suspense fallback={<Loading />}>
        <PageContent />
      </Suspense>
    </div>
  );
};

export default Page;
