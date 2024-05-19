
import { SocioEntity } from "src/socio/socio.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    foundationday: number;

    @Column()
    foundationmonth: number;

    @Column()
    foundationyear: number;

    @Column()
    description: string;
 
    @Column()
    image: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubs)
   socios: SocioEntity[];
}
