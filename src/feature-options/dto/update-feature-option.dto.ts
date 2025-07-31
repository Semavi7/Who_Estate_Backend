import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateFeatureOptionDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    category?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    value?: string
}
