import { ApiProperty } from '@nestjs/swagger';

class AuthUserResponseSchema {
  @ApiProperty({ example: 'admin.alertas' })
  sub: string;

  @ApiProperty({ example: 'admin.alertas' })
  username: string;

  @ApiProperty({ example: 'admin.alertas@local', required: false })
  email?: string;

  @ApiProperty({ example: 'Administrador' })
  name: string;

  @ApiProperty({ example: ['admin'], type: [String] })
  roles: string[];
}

export class AuthResponseSchema {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: '24h' })
  expiresIn: string;

  @ApiProperty({ type: AuthUserResponseSchema })
  user: AuthUserResponseSchema;
}
