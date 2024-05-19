
import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        username: faker.internet.userName(),
          email: faker.internet.email(),
          birthday: faker.number.int({ min: 1, max: 31 }),
          birthmonth: faker.number.int({ min: 1, max: 12 }),
          birthyear: faker.number.int({ min: 0, max: 2024 }),
      });
      sociosList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find all should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();

    expect(socios).not.toBeNull();
    expect(socios.length).toBe(sociosList.length);
  });

  it('findone should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);

    expect(socio).not.toBeNull();
    expect(socio.username).toEqual(storedSocio.username);
    expect(socio.email).toEqual(storedSocio.email);
    expect(socio.birthday).toEqual(storedSocio.birthday);
    expect(socio.birthmonth).toEqual(storedSocio.birthmonth);
    expect(socio.birthyear).toEqual(storedSocio.birthyear);
  });

  it('findOne should throw an exception for an invalid socio id', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: "",
      username: faker.internet.userName(),
          email: faker.internet.email(),
          birthday: faker.number.int({ min: 1, max: 31 }),
          birthmonth: faker.number.int({ min: 1, max: 12 }),
          birthyear: faker.number.int({ min: 0, max: 2024 }),
      clubs: []
    }

    const newSocio: SocioEntity = await service.create(socio);

    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}});

    expect(storedSocio).not.toBeNull();
    expect(newSocio.username).toEqual(storedSocio.username);
    expect(newSocio.email).toEqual(storedSocio.email);
    expect(newSocio.birthday).toEqual(storedSocio.birthday);
    expect(newSocio.birthmonth).toEqual(storedSocio.birthmonth);
    expect(newSocio.birthyear).toEqual(storedSocio.birthyear);

  });

  it('create should throw an exception for an invalid socio email', async () => {
    const socio: SocioEntity = {
      id: "",
      username: faker.internet.userName(),
          email: "correo1223",
          birthday: faker.number.int({ min: 1, max: 31 }),
          birthmonth: faker.number.int({ min: 1, max: 12 }),
          birthyear: faker.number.int({ min: 0, max: 2024 }),
      clubs: []
    }

    await expect(() => service.create(socio)).rejects.toHaveProperty("message", "The socio's mail has an invalid format");
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.username= "berni";
    socio.email= "correo@a.com";
    socio.birthday= 2;
    socio.birthmonth= 4;
    socio.birthyear= 2000;

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}});
    expect(storedSocio).not.toBeNull();

    expect(updatedSocio.username).toEqual(storedSocio.username);
    expect(updatedSocio.email).toEqual(storedSocio.email);
    expect(updatedSocio.birthday).toEqual(storedSocio.birthday);
    expect(updatedSocio.birthmonth).toEqual(storedSocio.birthmonth);
    expect(updatedSocio.birthyear).toEqual(storedSocio.birthyear);
  });

  it('update should throw an exception for an invalid socio id', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.username= "berni";
    socio.email= "correo@a.com";
    socio.birthday= 2;
    socio.birthmonth= 4;
    socio.birthyear= 2000;

    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "Socio no encontrado");
  });

  it('update should throw an exception for an invalid socio email', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.username= "berni";
    socio.email= "correoa.com";
    socio.birthday= 2;
    socio.birthmonth= 4;
    socio.birthyear= 2000;

    await expect(() => service.update(socio.id, socio)).rejects.toHaveProperty("message", "The socio's mail has an invalid format");
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    const searchedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}});
    expect(searchedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Socio no encontrado");
  });

});