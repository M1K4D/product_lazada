import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class categoryCreateDto {
  @ApiProperty({ example: 'sku-0123' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
