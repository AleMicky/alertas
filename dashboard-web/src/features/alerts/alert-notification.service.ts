import { http } from '@/lib/http';

import { AlertNotification } from './alert-notification.types';

const endpoint = '/alert-notifications';

export const alertNotificationService = {
  getAll: async (): Promise<AlertNotification[]> =>
    (await http.get<AlertNotification[]>(endpoint)).data,

  getById: async (id: string): Promise<AlertNotification> =>
    (await http.get<AlertNotification>(`${endpoint}/${id}`)).data,

  getByAlertId: async (alertId: string): Promise<AlertNotification[]> =>
    (await http.get<AlertNotification[]>(`${endpoint}/alert/${alertId}`)).data,

  getByStatus: async (status: string): Promise<AlertNotification[]> =>
    (await http.get<AlertNotification[]>(`${endpoint}/status/${status}`)).data,
};
