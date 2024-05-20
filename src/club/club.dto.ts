import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    foundationday: string;

    @IsString()
    @IsNotEmpty()
    foundationmonth: string;

    @IsString()
    @IsNotEmpty()
    foundationyear: string;

    @IsUrl()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}