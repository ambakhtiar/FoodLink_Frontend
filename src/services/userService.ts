import { apiClient } from "@/lib/axios";
import { ApiResponse } from "./authService";
import { User } from "@/store/authStore";

export const userService = {
    async updateProfilePicture(file: File): Promise<ApiResponse<User>> {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await apiClient.patch<ApiResponse<User>>(
            "/user/profile-picture",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    },

    async deleteProfilePicture(): Promise<ApiResponse<null>> {
        const { data } = await apiClient.delete<ApiResponse<null>>("/user/profile-picture");
        return data;
    },
};
