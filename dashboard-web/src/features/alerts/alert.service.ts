import { http } from '@/lib/http';

import { Alert } from './alert.types';

const endpoint = '/alerts';

export const alertService = {
  getAll: async (): Promise<Alert[]> =>
    (await http.get<Alert[]>(endpoint)).data,

  getById: async (id: string): Promise<Alert> =>
    (await http.get<Alert>(`${endpoint}/${id}`)).data,

  getByStatus: async (status: string): Promise<Alert[]> =>
    (await http.get<Alert[]>(`${endpoint}/status/${status}`)).data,

  getByEventId: async (eventId: string): Promise<Alert[]> =>
    (await http.get<Alert[]>(`${endpoint}/event/${eventId}`)).data,
};
