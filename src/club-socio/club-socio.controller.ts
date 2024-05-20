import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(
        private readonly clubSocioService: ClubSocioService
    ) {}

    @Post(':idClub/members/:idSocio')
    async addMemberToClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string) {
        return await this.clubSocioService.addMemberToClub(idClub, idSocio);
    }

    @Get(':idClub/members')
    async findMembersFromClub(@Param('idClub') idClub: string) {
        return await this.clubSocioService.findMembersFromClub(idClub);
    }

    @Get(':idClub/members/:idSocio')
    async findMemberFromClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string) {
        return await this.clubSocioService.findMemberFromClub(idClub, idSocio);
    }

    @Put(':idClub/members')
    async updateMembersFromClub(@Param('idClub') idClub: string, @Body() sociosDto: SocioDto[]) {
        const socios: SocioEntity[] = plainToInstance(SocioEntity, sociosDto);
        return await this.clubSocioService.updateMembersFromClub(idClub, socios);
    }

    @Delete(':idClub/members/:idSocio')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('idClub') idClub: string, @Param('idSocio') idSocio: string) {
        return await this.clubSocioService.deleteMemberFromClub(idClub, idSocio);
    }

}