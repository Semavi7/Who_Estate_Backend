import { IsNotEmpty, IsString } from "class-validator";

export class CreateFeatureOptionDto {
    @IsString()
    @IsNotEmpty()
    category: string

    @IsString()
    @IsNotEmpty()
    value: string
}
