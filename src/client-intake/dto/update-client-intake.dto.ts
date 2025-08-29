import { PartialType } from '@nestjs/mapped-types';
import { CreateClientIntakeDto } from './create-client-intake.dto';

export class UpdateClientIntakeDto extends PartialType(CreateClientIntakeDto) {}
