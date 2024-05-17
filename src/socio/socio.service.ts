import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { BusinessError, BusinessLogicException } from '../shared/erros/business-erros';

@Injectable()
export class SocioService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find({ relations: ["clubs"] });
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["clubs"] } );
        
        return socio;
    }
    
    async create(socio: SocioEntity): Promise<SocioEntity> {
        if (socio.email.includes("@")){
            return await this.socioRepository.save(socio);
        }
        else
        {
            throw new BusinessLogicException("The socio's mail has an invalid format", BusinessError.BAD_FORMAT);
        }
        
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (persistedSocio.email.includes("@"))
            {
                return await this.socioRepository.save({...persistedSocio, ...socio});
            }
            else
        {
            throw new BusinessLogicException("The socio's mail has an invalid format", BusinessError.BAD_FORMAT);
        }
        
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        
        await this.socioRepository.remove(socio);
    }
}