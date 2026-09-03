import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  findAll() {
    return this.vehiculosService.findAll();
  }

  @Get(':placa')
  findOne(@Param('placa') placa: string) {
    return this.vehiculosService.findOne(placa);
  }

  @Patch(':placa')
  update(@Param('placa') placa: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(placa, updateVehiculoDto);
  }

  @Delete(':placa')
  remove(@Param('placa') placa: string) {
    return this.vehiculosService.remove(placa);
  }
}