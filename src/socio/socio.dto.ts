import {  IsNotEmpty, IsString } from "class-validator";

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    birthday: string;

    @IsString()
    @IsNotEmpty()
    birthmonth: string;

    @IsString()
    @IsNotEmpty()
    birthyear: string;
}