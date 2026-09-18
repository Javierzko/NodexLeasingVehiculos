// src/calculos2/calculos2.module.ts

import { Module } from '@nestjs/common';
import { Calculos2Service } from './calculos2.service';
import { Calculos2Controller } from './calculos2.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Calculos2Controller],
  providers: [Calculos2Service],
  exports: [Calculos2Service],
})
export class Calculos2Module {}