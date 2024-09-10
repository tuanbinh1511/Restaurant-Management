import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  upload: (FormData: FormData) =>
    http.post<UploadImageResType>("/media/upload", FormData),
};
export default mediaApiRequest;
