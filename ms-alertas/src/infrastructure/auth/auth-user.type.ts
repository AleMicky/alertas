export type AuthUser = {
  sub: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
};

export type JwtPayload = {
  sub: string;
  username: string;
  email?: string;
  roles: string[];
};
