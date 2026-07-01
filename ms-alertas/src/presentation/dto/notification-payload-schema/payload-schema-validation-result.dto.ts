import { ApiProperty } from '@nestjs/swagger';

export class PayloadSchemaValidationResultDto {
  @ApiProperty({ type: Boolean })
  valid: boolean;

  @ApiProperty({ type: [String] })
  errors: string[];
}
