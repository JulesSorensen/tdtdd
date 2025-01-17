import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class UpdateBookDto {
    @IsString()
    @IsOptional()
    isbn?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsString()
    @IsOptional()
    publisher?: string;

    @IsString()
    @IsOptional()
    publishedDate?: string;

    @IsInt()
    @IsOptional()
    pageCount?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    genres?: string[];
}
