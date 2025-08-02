import { IsOptional, IsString } from "class-validator";

export class FilterPropertyDto{
    @IsString() @IsOptional() propertyType?: string
    @IsString() @IsOptional() listingType?: string
    @IsString() @IsOptional() subType?: string
}