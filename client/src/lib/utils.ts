import authApiRequest from "@/apiRequests/auth";
import { toast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

const isBrowser = typeof window !== "undefined";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;
export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const settAccessTokenToLocalStorage = (token: string) =>
  isBrowser && localStorage.setItem("accessToken", token);
export const setRefreshTokenToLocalStorage = (token: string) =>
  isBrowser && localStorage.setItem("refreshToken", token);

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (params: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
  const now = new Date().getTime() / 1000 - 1;
  if (decodedRefreshToken.exp <= now) {
    // vi du access token co thoi gian het han la 10s thi minh kiem tra con 1/3 tgian la 3s thi minh cho refresh token
    // thoi gian con lai tien tren cong thuc : decodedAccessToken.exp - now
    // thoi gian het han cua access token tien tren cong thuc : decodedAccessToken.exp - decodedAccessToken.iat
    return;
  }
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // goi api refresh token
    try {
      const res = await authApiRequest.refreshToken();
      settAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      params?.onSuccess && params.onSuccess();
    } catch (error) {
      params?.onError && params.onError();
    }
  }
};
