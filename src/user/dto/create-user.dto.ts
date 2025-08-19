import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail() email: string
    @IsString() @IsNotEmpty() name: string
    @IsString() @IsNotEmpty() surname: string
    @IsString() @MinLength(6) password: string
}
