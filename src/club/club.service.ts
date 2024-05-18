import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { BusinessError, BusinessLogicException } from '../shared/erros/business-erros';

@Injectable()
export class ClubService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["socios"] } );
        if (!club) 
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND)
        return club;
    }
    
    async create(club: ClubEntity): Promise<ClubEntity> {
        if (club.description.length<100){
            return await this.clubRepository.save(club);
        }
        else
        {
            throw new BusinessLogicException("The club descrpition must be shorter than 100 characters", BusinessError.PRECONDITION_FAILED);
        }
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedClub) 
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND)
        if (persistedClub.description.length<100)
            {
                return await this.clubRepository.save({...persistedClub, ...club});
            }
            else
        {
            throw new BusinessLogicException("The club descrpition must be shorter than 100 characters", BusinessError.PRECONDITION_FAILED);
        }
            
        
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club) 
            throw new BusinessLogicException("Club no encontrado", BusinessError.NOT_FOUND)
        await this.clubRepository.remove(club);
    }
}