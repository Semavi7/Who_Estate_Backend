import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMessageDto {
    @IsString() @IsNotEmpty() @MaxLength(100) title: string
    @IsEmail() @IsNotEmpty() email: string
    @IsString() @IsNotEmpty() description: string
}
