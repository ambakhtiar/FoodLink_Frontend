import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";

export function useMyRequestsQuery() {
  return useQuery({
    queryKey: ["my-requests"],
    queryFn: () => transactionService.getMyRequests({ limit: 100 }), // Fetch a good amount for now
  });
}
