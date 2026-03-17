import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { getItemsResponseSchema } from "@/lib/schemas/item.schema";

type GetItemsParams = {
  pageNumber?: number;
  pageSize?: number;
};

export async function getItems(params: GetItemsParams = {}) {
  const response = await api.get("/Items", {
    params: {
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  });

  return getItemsResponseSchema.parse(response.data);
}

export function useGetItems(params: GetItemsParams = {}) {
  return useQuery({
    queryKey: ["items", params.pageNumber ?? 1, params.pageSize ?? 20],
    queryFn: () => getItems(params),
  });
}
