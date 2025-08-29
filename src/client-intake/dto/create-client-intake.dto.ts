import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateClientIntakeDto {
    @IsString() @IsNotEmpty() namesurname: string
    @IsString() @IsNotEmpty() description: string
    @Type(() => Number) @IsNumber() @IsNotEmpty() phone: number
}