import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryRepository } from 'src/repository/category.repository';
import { CateroryController } from './caterory.controller';
import { CateroryService } from './caterory.service';

@Module({
  imports: [TypeOrmModule.forFeature([categoryRepository])],
  controllers: [CateroryController],
  providers: [CateroryService],
})
export class CateroryModule {}
