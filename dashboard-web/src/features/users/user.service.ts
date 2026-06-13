import { baseService } from '@/shared/core/base.service';
import { http } from '@/lib/http';
import type { CreateUserDto, UpdateUserDto } from './user.schema';
import { normalizeUserRoles, type User } from './user.types';

const endpoint = '/users';

function mapUser(user: User): User {
  return {
    ...user,
    roles: normalizeUserRoles(user.roles),
  };
}

export const userService = {
  ...baseService<User, CreateUserDto, UpdateUserDto>(endpoint),

  getAll: async (): Promise<User[]> => {
    const { data } = await http.get<User[]>(endpoint);
    return data.map(mapUser);
  },

  create: async (payload: CreateUserDto): Promise<User> => {
    const { data } = await http.post<User>(endpoint, payload);
    return mapUser(data);
  },

  update: async (id: string, payload: UpdateUserDto): Promise<User> => {
    const { password, ...rest } = payload;
    const body = password ? { ...rest, password } : rest;

    const { data } = await http.patch<User>(`${endpoint}/${id}`, body);
    return mapUser(data);
  },
};
