import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setRefreshTokenToLocalStorage,
  settAccessTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/router";
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Phai goi lan dau tien vi interval chay sau timeout
    const TIMEOUT = 1000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  return null;
}
