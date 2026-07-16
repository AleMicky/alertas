export class AuthUserResponseDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}

export class MessageResponseDto {
  message: string;
}
