import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      const refreshToken = getRefreshTokenFromLocalStorage();
      const accessToken = getAccessTokenFromLocalStorage();
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);
      if (decodedRefreshToken.exp <= now) {
        return;
      }
    };
  }, [pathname]);
  return null;
}
