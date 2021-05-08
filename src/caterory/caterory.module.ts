import { Module } from '@nestjs/common';
import { CateroryController } from './caterory.controller';
import { CateroryService } from './caterory.service';

@Module({
  controllers: [CateroryController],
  providers: [CateroryService]
})
export class CateroryModule {}
