import { http } from '@/lib/http';

export function baseService<
    T,
    CreateDto,
    UpdateDto,
>(
    endpoint: string,
) {

    return {
        getAll: async (): Promise<T[]> => (await http.get<T[]>(endpoint)).data,
        create: async (data: CreateDto): Promise<T> => (await http.post<T>(endpoint, data)).data,
        update: async (id: string, data: UpdateDto): Promise<T> => (await http.patch<T>(`${endpoint}/${id}`, data)).data,
        remove: async (id: string): Promise<void> => (await http.delete(`${endpoint}/${id}`)).data,
    };
}