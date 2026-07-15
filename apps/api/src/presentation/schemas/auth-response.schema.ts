import { ApiProperty } from '@nestjs/swagger';

class AuthUserResponseSchema {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'admin.alertas' })
  username: string;

  @ApiProperty({ example: 'admin@alertas.local' })
  email: string;

  @ApiProperty({ example: 'Administrador' })
  fullName: string;

  @ApiProperty({ example: ['ADMIN'], type: [String] })
  roles: string[];
}

export class AuthResponseSchema {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: AuthUserResponseSchema })
  user: AuthUserResponseSchema;
}
