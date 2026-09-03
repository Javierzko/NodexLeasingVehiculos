import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { AuditoriaMultasService } from './auditoria-multas.service';

import { CreateAuditoriaMultaDto } from './dto/create-auditoria-multa.dto';

import { UpdateAuditoriaMultaDto } from './dto/update-auditoria-multa.dto';

@Controller('auditoria-multas')
export class AuditoriaMultasController {

  constructor(
    private readonly auditoriaMultasService: AuditoriaMultasService,
  ) {}

  @Post()
  create(@Body() createDto: CreateAuditoriaMultaDto) {
    return this.auditoriaMultasService.create(createDto);
  }

  @Get()
  findAll() {
    return this.auditoriaMultasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditoriaMultasService.findOne(id);
  }

  @Get('caso/:casoId')
  findByCasoId(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    return this.auditoriaMultasService.findByCasoId(casoId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAuditoriaMultaDto,
  ) {
    return this.auditoriaMultasService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.auditoriaMultasService.remove(id);
  }
}