import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
    @IsString() @IsNotEmpty() name: string
    @IsEmail() @IsNotEmpty() email: string
    @IsString() @IsNotEmpty() message: string
    @IsString() @IsNotEmpty() surname: string
    @IsNumber() @IsNotEmpty() phone: number
}
