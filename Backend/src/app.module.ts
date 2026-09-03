import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LocatariosModule } from './locatarios/locatarios.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { CasosModule } from './casos/casos.module';
import { PropietariosModule } from './propietarios/propietarios.module';
import { ProcesoJuridicoModule } from './proceso-juridico/proceso-juridico.module';
import { AuditoriaMultasModule } from './auditoria-multas/auditoria-multas.module';
import { BusquedaModule } from './busqueda/busqueda.module';
import { GestionModule } from './CrearGestion/gestion.module';
import { EstadosModule } from './estados/estados.module';
import { GestionMasivaModule } from './MasivosDatoG/gestion-masiva.module';
import { InyeccionMasivaModule } from './InyeccionMasiva/inyeccion-masiva.module';
import { PortalConsultaModule } from './portal-consulta/portal-consulta.module';
import { SeguimientoPortalModule } from './seguimiento-portal/seguimiento-portal.module';
import { ArchivosModule } from './archivos/archivos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    LocatariosModule,
    VehiculosModule,
    CasosModule,
    PropietariosModule,
    ProcesoJuridicoModule,
    AuditoriaMultasModule,
    BusquedaModule,
    GestionModule,
    EstadosModule,
    GestionMasivaModule,
    InyeccionMasivaModule,
    PortalConsultaModule,
    SeguimientoPortalModule,
    ArchivosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
