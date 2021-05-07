import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductUpdateDto {
  @ApiProperty({ example: 'name-test' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'brand-name' })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({ example: 'test-api-description' })
  @IsString()
  @IsOptional()
  discription: string;

  @ApiProperty({ example: 'test-api-category' })
  @IsString()
  @IsOptional()
  category: string;
}
