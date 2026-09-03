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

import { ProcesoJuridicoService } from './proceso-juridico.service';

import { CreateProcesoJuridicoDto } from './dto/create-proceso-juridico.dto';

import { UpdateProcesoJuridicoDto } from './dto/update-proceso-juridico.dto';

@Controller('proceso-juridico')
export class ProcesoJuridicoController {

  constructor(
    private readonly procesoJuridicoService: ProcesoJuridicoService,
  ) {}

  @Post()
  create(@Body() createProcesoJuridicoDto: CreateProcesoJuridicoDto) {
    return this.procesoJuridicoService.create(createProcesoJuridicoDto);
  }

  @Get()
  findAll() {
    return this.procesoJuridicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.procesoJuridicoService.findOne(id);
  }

  @Get('caso/:casoId')
  findByCasoId(@Param('casoId', ParseIntPipe) casoId: number) {
    return this.procesoJuridicoService.findByCasoId(casoId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProcesoJuridicoDto: UpdateProcesoJuridicoDto,
  ) {
    return this.procesoJuridicoService.update(id, updateProcesoJuridicoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.procesoJuridicoService.remove(id);
  }

}