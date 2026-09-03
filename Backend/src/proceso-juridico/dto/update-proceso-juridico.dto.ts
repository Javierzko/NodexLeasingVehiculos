import { PartialType } from '@nestjs/mapped-types';
import { CreateProcesoJuridicoDto } from './create-proceso-juridico.dto';

export class UpdateProcesoJuridicoDto extends PartialType(CreateProcesoJuridicoDto) {}
