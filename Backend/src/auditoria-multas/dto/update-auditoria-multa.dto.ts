import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditoriaMultaDto } from './create-auditoria-multa.dto';

export class UpdateAuditoriaMultaDto extends PartialType(CreateAuditoriaMultaDto) {}
