import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioService } from './socio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';

@Controller('socios')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(
        private readonly socioService: SocioService
    ) {}

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':idSocio')
    async findOne(@Param('idSocio') idSocio: string) {
        return await this.socioService.findOne(idSocio);
    }

    @Post()
    async create(@Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }

    @Put(':idSocio')
    async update(@Param('idSocio') idSocio: string, @Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(idSocio, socio);
    }

    @Delete(':idSocio')
    @HttpCode(204)
    async delete(@Param('idSocio') idSocio: string) {
        return await this.socioService.delete(idSocio);
    }

}