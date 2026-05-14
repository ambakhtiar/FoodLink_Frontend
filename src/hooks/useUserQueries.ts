import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function usePublicProfileQuery(userId: string) {
    return useQuery({
        queryKey: ["public-profile", userId],
        queryFn: () => userService.getPublicProfile(userId),
        enabled: !!userId,
    });
}
