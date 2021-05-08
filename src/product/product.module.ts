import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryRepository } from 'src/repository/category.repository';
import { ProductRepository } from 'src/repository/product.repository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository, categoryRepository])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
