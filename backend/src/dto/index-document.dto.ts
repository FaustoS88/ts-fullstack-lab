import { IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class IndexDocumentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  data?: string; // base64-encoded PDF

  @IsOptional()
  @IsString()
  published?: string;
}
