import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';

export function baseService<
    T,
    CreateDto,
    UpdateDto,
>(
    endpoint: string,
) {

    return {
        getAll: async (): Promise<T[]> =>
          unwrapApiResponse<T[]>(
            (await http.get(endpoint)).data,
          ),
        create: async (data: CreateDto): Promise<T> =>
          unwrapApiResponse<T>(
            (await http.post(endpoint, data)).data,
          ),
        update: async (id: string, data: UpdateDto): Promise<T> =>
          unwrapApiResponse<T>(
            (await http.patch(`${endpoint}/${id}`, data)).data,
          ),
        remove: async (id: string): Promise<void> => {
          unwrapApiResponse<void>(
            (await http.delete(`${endpoint}/${id}`)).data,
          );
        },
    };
}