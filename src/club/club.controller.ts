import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubService } from './club.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
    constructor(
        private readonly clubService: ClubService
    ) {}

    @Get()
    async findAll() {
        return await this.clubService.findAll();
    }

    @Get(':idClub')
    async findOne(@Param('idClub') idClub: string) {
        return await this.clubService.findOne(idClub);
    }

    @Post()
    async create(@Body() clubDto: ClubDto) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.create(club);
    }

    @Put(':idClub')
    async update(@Param('idClub') idClub: string, @Body() clubDto: ClubDto) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.update(idClub, club);
    }

    @Delete(':idClub')
    @HttpCode(204)
    async delete(@Param('idClub') idClub: string) {
        return await this.clubService.delete(idClub);
    }
    
}