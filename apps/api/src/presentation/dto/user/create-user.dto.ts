import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional } from "class-validator";


export class CreateUserDto {
    @ApiProperty({ type: String, example: 'alejandro.mamani' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ type: String, example: 'alejandro.mamani@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ type: String, example: 'Password123*' })
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty({ type: String, example: 'Alejandro Mamani' })
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @ApiProperty({ type: [String], example: ['admin', 'user'] })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    roles?: string[]
}