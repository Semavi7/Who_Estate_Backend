import { Type } from "class-transformer";
import { IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreatePropertyDto {
    @IsString() @IsNotEmpty() title: string
    @IsString() @IsNotEmpty() description: string
    @Type(() => Number) @IsNumber() price: number
    @Type(() => Number) @IsNumber() gross: number
    @Type(() => Number) @IsNumber() net: number
    @IsString() @IsNotEmpty() numberOfRoom: string
    @Type(() => Number) @IsNumber() buildingAge: number
    @Type(() => Number) @IsNumber() floor: number
    @Type(() => Number) @IsNumber() numberOfFloors: number
    @IsString() @IsNotEmpty() heating: string
    @Type(() => Number) @IsNumber() numberOfBathrooms: number
    @IsString() @IsNotEmpty() kitchen: string
    @Type(() => Number) @IsNumber() balcony: number
    @IsString() @IsNotEmpty() lift: string
    @IsString() @IsNotEmpty() parking: string
    @IsString() @IsNotEmpty() furnished: string
    @IsString() @IsNotEmpty() availability: string
    @Type(() => Number) @IsNumber() dues: number
    @IsString() @IsNotEmpty() eligibleForLoan: string
    @IsString() @IsNotEmpty() titleDeedStatus: string
    @IsString() @IsOptional() userId?: string
    @Type(() => Number) @IsNumber() @IsOptional() userPhone: number
    @IsJSON() @IsNotEmpty() location: string
    @IsString() @IsNotEmpty() propertyType: string
    @IsString() @IsNotEmpty() listingType: string
    @IsString() @IsOptional() subType?: string
    @IsJSON() @IsOptional() selectedFeatures?: string
}
