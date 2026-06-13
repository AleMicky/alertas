import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshDto {
  @ApiProperty({ type: String, example: 'refresh_token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}