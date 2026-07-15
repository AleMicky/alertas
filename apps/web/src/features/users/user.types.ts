import type { BaseAuditableEntity } from '@/shared/core/base-auditable.type';

export type UserRoleRef = {
  id: string;
  code: string;
  name: string;
};

export interface User extends BaseAuditableEntity {
  id: string;
  username: string;
  email: string;
  fullName: string;
  active?: boolean;
  roles: string[] | UserRoleRef[];
}

export function normalizeUserRoles(
  roles: User['roles'] | undefined,
): string[] {
  if (!roles?.length) return [];

  return roles.map((role) =>
    typeof role === 'string' ? role : role.code,
  );
}
