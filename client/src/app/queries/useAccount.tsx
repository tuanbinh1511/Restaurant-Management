import accountApiRequest from "@/apiRequests/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMeQuery = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequest.me,
  });
};
export const useUpdateAccountMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.update,
  });
};

export const useChangePasswordAccountMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};
