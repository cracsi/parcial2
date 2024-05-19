import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          foundationday: faker.number.int({ min: 1, max: 31 }),
          foundationmonth: faker.number.int({ min: 1, max: 12 }),
          foundationyear: faker.number.int({ min: 0, max: 2024 }),
          image: faker.image.url()
      });
      clubsList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find all should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    
    expect(clubs).not.toBeNull();
    expect(clubs.length).toBe(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const club: ClubEntity = clubsList[0];

    const searchClub: ClubEntity = await service.findOne(club.id);

    expect(searchClub).not.toBeNull();
    expect(club.name).toEqual(searchClub.name);
    expect(club.description).toEqual(searchClub.description);
    expect(club.foundationday).toEqual(searchClub.foundationday);
    expect(club.foundationmonth).toEqual(searchClub.foundationmonth);
    expect(club.foundationyear).toEqual(searchClub.foundationyear);
    expect(club.image).toEqual(searchClub.image);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      name: 
      faker.company.name(),
          description: faker.lorem.sentence(),
          foundationday: faker.number.int({ min: 1, max: 31 }),
          foundationmonth: faker.number.int({ min: 1, max: 12 }),
          foundationyear: faker.number.int({ min: 0, max: 2024 }),
          image: faker.image.url(),
      socios:[]
    };

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}});
    expect(storedClub).not.toBeNull();
    
    expect(storedClub.name).toEqual(newClub.name);
    expect(storedClub.description).toEqual(newClub.description);
    expect(storedClub.foundationday).toEqual(newClub.foundationday);
    expect(storedClub.foundationmonth).toEqual(newClub.foundationmonth);
    expect(storedClub.foundationyear).toEqual(newClub.foundationyear);
    expect(storedClub.image).toEqual(newClub.image);

  });

  it('create should throw an exception for an invalid club description', async () => {
    const club: ClubEntity = {
      id: "",
      name: 
      faker.company.name(),
          description: faker.lorem.sentence({ min: 105, max: 110 }),
          foundationday: faker.number.int({ min: 1, max: 31 }),
          foundationmonth: faker.number.int({ min: 1, max: 12 }),
          foundationyear: faker.number.int({ min: 0, max: 2024 }),
          image: faker.image.url(),
      socios:[]
    };

    await expect(() => service.create(club)).rejects.toHaveProperty("message", "The club descrpition must be shorter than 100 characters");
  });

  it('update should modify a museum', async () => {
    const club: ClubEntity = clubsList[0];
    club.name="Gucci Boys Club";
    club.description="Gucci Gucci Gucci Boys Club Gucci Boys Club Gucci Gucci Gucci Boys Club Gucci Boys Club";
    club.foundationday=21;
    club.foundationmonth=4;
    club.foundationyear=1990;
    club.image="GBCimage";

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: club.id}});
    expect(storedClub).not.toBeNull();

    expect(storedClub.name).toEqual(updatedClub.name);
    expect(storedClub.description).toEqual(updatedClub.description);
    expect(storedClub.foundationday).toEqual(updatedClub.foundationday);
    expect(storedClub.foundationmonth).toEqual(updatedClub.foundationmonth);
    expect(storedClub.foundationyear).toEqual(updatedClub.foundationyear);
    expect(storedClub.image).toEqual(updatedClub.image);
  });

  it('update should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubsList[0];
    club.name="Gucci Boys Club";
    club.description="Gucci Gucci Gucci Boys Club Gucci Boys Club Gucci Gucci Gucci Boys Club Gucci Boys Club";
    club.foundationday=21;
    club.foundationmonth=4;
    club.foundationyear=1990;
    club.image="GBCimage";

    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "Club no encontrado");
  });

  it('update should throw an exception for an invalid club description', async () => {
    const club: ClubEntity = clubsList[0];
    club.name="Gucci Boys Club";
    club.description=faker.lorem.sentence({ min: 105, max: 110 });
    club.foundationday=21;
    club.foundationmonth=4;
    club.foundationyear=1990;
    club.image="GBCimage";

    await expect(() => service.update(club.id, club)).rejects.toHaveProperty("message", "The club descrpition must be shorter than 100 characters");
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);
    const storedClub: ClubEntity = await repository.findOne({where: {id: club.id}});
    expect(storedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Club no encontrado");
  });


});