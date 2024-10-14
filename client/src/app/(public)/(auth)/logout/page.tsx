"use client";

import { useLogoutMutation } from "@/queries/useAuth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import React, { use, useEffect, useRef } from "react";
import { useAppContext } from "@/components/app-provider";

export default function LogoutPage() {
  //define
  const { mutateAsync } = useLogoutMutation();
  const searchParam = useSearchParams();
  const { setIsAuth } = useAppContext();
  const refreshTokenFromUrl = searchParam.get("refreshToken");
  const accessTokenFromUrl = searchParam.get("accessToken");

  const router = useRouter();

  //state
  const ref = useRef<any>(null);

  // useEffect
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push("/login");
        setIsAuth(false);
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);
  return <div>LogoutPage</div>;
}
