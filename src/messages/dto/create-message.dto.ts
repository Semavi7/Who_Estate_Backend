import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ description: 'name' }) @IsString() @IsNotEmpty() name: string
    @ApiProperty({ description: 'email', default: 'string@mail.com'}) @IsEmail() @IsNotEmpty() email: string
    @ApiProperty({ description: 'message' }) @IsString() @IsNotEmpty() message: string
    @ApiProperty({ description: 'surname' }) @IsString() @IsNotEmpty() surname: string
    @ApiProperty({ description: 'isread', default: false }) @IsBoolean() @IsNotEmpty() isread: boolean = false
    @ApiProperty({ description: 'phone' }) @Type(() => Number) @IsNumber() @IsNotEmpty() phone: number
}
