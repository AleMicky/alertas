export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type RefreshResponse = {
  accessToken: string;
};
