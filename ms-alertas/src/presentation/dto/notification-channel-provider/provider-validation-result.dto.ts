import { ApiProperty } from '@nestjs/swagger';

export class ProviderValidationResultDto {
  @ApiProperty({ type: Boolean })
  valid: boolean;

  @ApiProperty({ type: [String] })
  errors: string[];
}
