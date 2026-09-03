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

import { LocatariosService } from './locatarios.service';

import { CreateLocatarioDto } from './dto/create-locatario.dto';

import { UpdateLocatarioDto } from './dto/update-locatario.dto';

@Controller('locatarios')
export class LocatariosController {

  constructor(private readonly locatariosService: LocatariosService) {}

  @Post()
  create(@Body() createLocatarioDto: CreateLocatarioDto) {
    return this.locatariosService.create(createLocatarioDto);
  }

  @Get()
  findAll() {
    return this.locatariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locatariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocatarioDto: UpdateLocatarioDto,
  ) {
    return this.locatariosService.update(id, updateLocatarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locatariosService.remove(id);
  }

}