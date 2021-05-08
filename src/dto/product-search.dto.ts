import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brand: string;
}
