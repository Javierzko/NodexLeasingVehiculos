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

import { PropietariosService } from './propietarios.service';

import { CreatePropietarioDto } from './dto/create-propietario.dto';

import { UpdatePropietarioDto } from './dto/update-propietario.dto';

@Controller('propietarios')

export class PropietariosController {

  constructor(private readonly propietariosService: PropietariosService) {}

  @Post()

  create(@Body() createPropietarioDto: CreatePropietarioDto) {

    return this.propietariosService.create(createPropietarioDto);

  }

  @Get()

  findAll() {

    return this.propietariosService.findAll();

  }

  @Get(':id')

  findOne(@Param('id', ParseIntPipe) id: number) {

    return this.propietariosService.findOne(id);

  }

  @Get('identificacion/:identificacion')

  findByIdentificacion(@Param('identificacion') identificacion: string) {

    return this.propietariosService.findByIdentificacion(identificacion);

  }

  @Patch(':id')

  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropietarioDto: UpdatePropietarioDto,
  ) {

    return this.propietariosService.update(id, updatePropietarioDto);

  }

  @Delete(':id')

  remove(@Param('id', ParseIntPipe) id: number) {

    return this.propietariosService.remove(id);

  }

}