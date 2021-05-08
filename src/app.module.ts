import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './product/product.module';
import { CateroryModule } from './caterory/caterory.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductModule, CateroryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
