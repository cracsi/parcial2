
import { ClubEntity } from "src/club/club.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    username: string;
 
    @Column()
    email: string;
 
    @Column()
    birthday: number;

    @Column()
    birthmonth: number;

    @Column()
    birthyear: number;

    @ManyToMany(() => ClubEntity, club => club.socios)
   clubs: ClubEntity[];

}