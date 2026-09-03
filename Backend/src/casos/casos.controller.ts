//raiz src/casos/casos.controller.ts


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

import { CasosService } from './casos.service';

import { CreateCasoDto } from './dto/create-caso.dto';

import { UpdateCasoDto } from './dto/update-caso.dto';

@Controller('casos')
export class CasosController {

  constructor(private readonly casosService: CasosService) {}

  @Post()
  create(@Body() createCasoDto: CreateCasoDto) {
    return this.casosService.create(createCasoDto);
  }

  @Get()
  findAll() {
    return this.casosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.findOne(id);
  }

  @Get('contrato/:numeroContrato')
  findByNumeroContrato(@Param('numeroContrato') numeroContrato: string) {
    return this.casosService.findByNumeroContrato(numeroContrato);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCasoDto: UpdateCasoDto,
  ) {
    return this.casosService.update(id, updateCasoDto);
  }

  // Eliminar contrato
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.remove(id);
  }

  // Eliminar locatario
  @Delete('locatario/:id')
  removeLocatario(@Param('id', ParseIntPipe) id: number) {
    return this.casosService.removeLocatario(id);
  }
}