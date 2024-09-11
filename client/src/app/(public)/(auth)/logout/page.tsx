"use client";

import { useLogoutMutation } from "@/app/queries/useAuth";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const searchParam = useSearchParams();
  const refreshTokenFromUrl = searchParam.get("refreshToken");
  const ref = useRef<any>(null);
  const router = useRouter();
  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
    )
      return;
    ref.current = mutateAsync;
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromUrl]);
  return <div>LogoutPage</div>;
}
