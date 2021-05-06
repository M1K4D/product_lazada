import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductCreateDto {
  @ApiProperty({ example: 'sku-0123' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'name-test' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'brand-name' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 'test-api-description' })
  @IsString()
  @IsNotEmpty()
  discription: string;

  @ApiProperty({ example: 'test-api-category' })
  @IsString()
  @IsNotEmpty()
  category: string;
}
