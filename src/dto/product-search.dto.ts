import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({ example: 'ab001', required: false })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({ example: 't-shirt', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'category-type', required: false })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ example: 'brand', required: false })
  @IsString()
  @IsOptional()
  brand: string;
}
