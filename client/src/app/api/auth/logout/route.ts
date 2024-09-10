import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value as string;
  const refreshToken = cookieStore.get("accessToken")?.value as string;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken && !refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy accessToken và refreshToken",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.sLogout({
      accessToken,
      refreshToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      {
        message: "Lỗi gọi api Logout server",
      },
      {
        status: 200,
      }
    );
  }
}
