import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { Product } from 'src/entity/product.entity';
import { ProductRepository } from 'src/repository/product.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProduct(query: ProductSearchDto): Promise<object> {
    const { sku, name, category, brand } = query;
    try {
      const products = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('product');

      if (sku) {
        products.andWhere('product.sku ilike :sku', { sku: `%${sku}%` });
      }

      if (name) {
        products.andWhere('product.name ilike :name', { name: `%${name}%` });
      }

      if (category) {
        products.andWhere('product.category ilike :category', {
          category: `%${category}%`,
        });
      }

      if (brand) {
        products.andWhere('product.brand ilike :brand', {
          brand: `%${brand}%`,
        });
      }

      const result = await products.getMany();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: error.message,
      });
    }
  }

  async addProduct(body: ProductCreateDto): Promise<any> {
    const { sku, name, brand, price, quantity, discription, category } = body;
    try {
      const find_product = await this.productRepository.findOne({
        where: { sku: sku },
      });
      if (find_product) throw new Error('sku is duplicate');

      const product = new Product();

      product.sku = sku;
      product.name = name;
      product.brand = brand;
      product.price = price;
      product.quantity = quantity;
      product.category = category;
      product.discription = discription;
      await product.save();

      return {
        success: true,
        message: 'add success.',
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error.message,
      });
    }
  }
}
