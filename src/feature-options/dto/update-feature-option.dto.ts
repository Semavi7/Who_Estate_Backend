import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureOptionDto } from './create-feature-option.dto';

export class UpdateFeatureOptionDto extends PartialType(CreateFeatureOptionDto) {}
