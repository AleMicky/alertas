export class AuthUserResponseDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponseDto;
}

export class RefreshResponseDto {
  accessToken: string;
}

export class MessageResponseDto {
  message: string;
}
