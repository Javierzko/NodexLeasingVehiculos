import { PartialType } from '@nestjs/mapped-types';
import { CreateLocatarioDto } from './create-locatario.dto';

export class UpdateLocatarioDto extends PartialType(CreateLocatarioDto) {}
