import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class CreateBookDto {
    @IsString()
    isbn: string;

    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsString()
    publisher: string;

    @IsString()
    publishedDate: string;

    @IsInt()
    pageCount: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    genres: string[];
}
