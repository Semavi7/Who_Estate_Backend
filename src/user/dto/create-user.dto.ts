import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail() @IsNotEmpty() email: string
    @IsString() @IsNotEmpty() name: string
    @IsString() @IsNotEmpty() surname: string
    @Type(() => Number) @IsNumber() @IsNotEmpty() phonenumber: number
}
