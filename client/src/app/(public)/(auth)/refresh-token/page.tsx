"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useRef } from "react";

export default function RefreshTokenPage() {
  //define
  const searchParam = useSearchParams();
  const refreshTokenFromUrl = searchParam.get("refreshToken");
  const accessTokenFromUrl = searchParam.get("accessToken");
  const redirectParams = searchParam.get("redirect");
  const router = useRouter();

  //state
  const ref = useRef<any>(null);

  // useEffect
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectParams || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromUrl, accessTokenFromUrl]);
  return <div>RefreshTokenPage</div>;
}
