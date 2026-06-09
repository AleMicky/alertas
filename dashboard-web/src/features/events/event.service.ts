
import { http } from "@/lib/http";
import { Event } from "./event.types";

const endpoint = '/events';

export const eventService = {
    getAll: async (): Promise<Event[]> => (await http.get<Event[]>(endpoint)).data,
    getById: async (id: string): Promise<Event> => (await http.get<Event>(`${endpoint}/${id}`)).data,
}