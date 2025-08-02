import { Type } from "class-transformer";
import { IsJSON, IsOptional, IsNumber, IsString } from "class-validator";

export class UpdatePropertyDto {
     @IsString() @IsOptional() title?: string
    @IsString() @IsOptional() description?: string
    @Type(() => Number) @IsNumber() @IsOptional() price?: number
    @Type(() => Number) @IsNumber() @IsOptional() gross?: number
    @Type(() => Number) @IsNumber() @IsOptional() net?: number
    @IsString() @IsOptional() numberOfRoom?: string
    @Type(() => Number) @IsNumber() @IsOptional() buildingAge?: number
    @Type(() => Number) @IsNumber() @IsOptional() floor?: number
    @Type(() => Number) @IsNumber() @IsOptional() numberOfFloors?: number
    @IsString() @IsOptional() heating?: string
    @Type(() => Number) @IsNumber() @IsOptional() numberOfBathrooms?: number
    @IsString() @IsOptional() kitchen?: string
    @Type(() => Number) @IsNumber() @IsOptional() balcony?: number
    @IsString() @IsOptional() lift?: string
    @IsString() @IsOptional() parking?: string
    @IsString() @IsOptional() furnished?: string
    @IsString() @IsOptional() availability?: string
    @Type(() => Number) @IsNumber() @IsOptional() dues?: number
    @IsString() @IsOptional() eligibleForLoan?: string
    @IsString() @IsOptional() titleDeedStatus?: string
    @IsJSON() @IsOptional() location?: string
    @IsString() @IsOptional() propertyType?: string
    @IsString() @IsOptional() listingType?: string
    @IsString() @IsOptional() subType?: string
    @IsJSON() @IsOptional() selectedFeatures?: string
    @IsJSON() @IsOptional() existingImageUrls?: string
}
