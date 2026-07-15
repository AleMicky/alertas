import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({ type: String, example: 'ADMIN' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ type: String, example: 'Administrador' })
    @IsString()
    @IsNotEmpty()
    name: string;
}