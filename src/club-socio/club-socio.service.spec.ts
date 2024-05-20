
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubSocioService } from './club-socio.service';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        username: faker.internet.userName(),
          email: faker.internet.email(),
          birthday: faker.number.int({ min: 1, max: 31 }),
          birthmonth: faker.number.int({ min: 1, max: 12 }),
          birthyear: faker.number.int({ min: 0, max: 2024 }),
      });
      sociosList.push(socio);
    }

    club = await clubRepository.save({
        name: 
        faker.company.name(),
            description: faker.lorem.sentence(),
            foundationday: faker.number.int({ min: 1, max: 31 }),
            foundationmonth: faker.number.int({ min: 1, max: 12 }),
            foundationyear: faker.number.int({ min: 0, max: 2024 }),
            image: faker.image.url(),
      socios: sociosList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthday: faker.number.int({ min: 1, max: 31 }),
        birthmonth: faker.number.int({ min: 1, max: 12 }),
        birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    const newClub: ClubEntity = await clubRepository.save({
        name: 
        faker.company.name(),
            description: faker.lorem.sentence(),
            foundationday: faker.number.int({ min: 1, max: 31 }),
            foundationmonth: faker.number.int({ min: 1, max: 12 }),
            foundationyear: faker.number.int({ min: 0, max: 2024 }),
            image: faker.image.url(),
      }
    );

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0].username).toEqual(newSocio.username);
    expect(result.socios[0].email).toEqual(newSocio.email);
    expect(result.socios[0].birthday).toEqual(newSocio.birthday);
    expect(result.socios[0].birthmonth).toEqual(newSocio.birthmonth);
    expect(result.socios[0].birthyear).toEqual(newSocio.birthyear);

  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
        email: faker.internet.email(),
        birthday: faker.number.int({ min: 1, max: 31 }),
        birthmonth: faker.number.int({ min: 1, max: 12 }),
        birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('addMemberToClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.addMemberToClub(club.id, "0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('findMembersFromClub should return socios by club', async () => {
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios).not.toBeNull();
    expect(socios.length).toBe(sociosList.length);
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findMembersFromClub("0")).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('findMemberFromClub should return socio of club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id);
    expect(storedSocio).not.toBeNull();

    expect(socio.username).toEqual(storedSocio.username);
    expect(socio.email).toEqual(storedSocio.email);
    expect(socio.birthday).toEqual(storedSocio.birthday);
    expect(socio.birthmonth).toEqual(storedSocio.birthmonth);
    expect(socio.birthyear).toEqual(storedSocio.birthyear);
  });

  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findMemberFromClub("0", sociosList[0].id)).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('findMemberFromClub should throw an exception for an invalid socio', async () => {
    await expect(() => service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('findMemberFromClub should throw an exception for a socio not associated to the club', async () => {
    const socio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthday: faker.number.int({ min: 1, max: 31 }),
      birthmonth: faker.number.int({ min: 1, max: 12 }),
      birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    await expect(() => service.findMemberFromClub(club.id, socio.id)).rejects.toHaveProperty("message", "Club no asociado al socio");
    
  });

  it('updateMembersFromClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthday: faker.number.int({ min: 1, max: 31 }),
      birthmonth: faker.number.int({ min: 1, max: 12 }),
      birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].username).toEqual(newSocio.username);
    expect(updatedClub.socios[0].email).toEqual(newSocio.email);
    expect(updatedClub.socios[0].birthday).toEqual(newSocio.birthday);
    expect(updatedClub.socios[0].birthmonth).toEqual(newSocio.birthmonth);
    expect(updatedClub.socios[0].birthyear).toEqual(newSocio.birthyear);

  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthday: faker.number.int({ min: 1, max: 31 }),
      birthmonth: faker.number.int({ min: 1, max: 12 }),
      birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    await expect(() => service.updateMembersFromClub("0", [socio])).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('updateMembersFromClub should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = {
      id: "0",
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthday: faker.number.int({ min: 1, max: 31 }),
      birthmonth: faker.number.int({ min: 1, max: 12 }),
      birthyear: faker.number.int({ min: 0, max: 2024 }),
      clubs: []
    };

    await expect(() => service.updateMembersFromClub(club.id, [socio])).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('deleteMemberFromClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id},relations:  ["socios"]});
    expect(storedClub).not.toBeNull();

    const deletedSocio: SocioEntity = storedClub.socios.find(e => e.id === socio.id);
    expect(deletedSocio).toBeUndefined();
  });

  it('deleteMemberFromClub should thrown an exception for an invalid socio', async () => {
    await expect(() => service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('deleteMemberFromClub should thrown an exception for an invalid club', async () => {
    await expect(() => service.deleteMemberFromClub("0", sociosList[0].id)).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('deleteMemberFromClub should thrown an exception for an non asocciated socio', async () => {
    const socio: SocioEntity = await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthday: faker.number.int({ min: 1, max: 31 }),
      birthmonth: faker.number.int({ min: 1, max: 12 }),
      birthyear: faker.number.int({ min: 0, max: 2024 }),
    });

    await expect(() => service.deleteMemberFromClub(club.id, socio.id)).rejects.toHaveProperty("message", "Club no asociado al socio");
  });
});