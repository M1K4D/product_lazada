import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { ProductUpdateDto } from 'src/dto/product.update.dto';
import { Product } from 'src/entity/product.entity';
import { ProductRepository } from 'src/repository/product.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductById(id: number): Promise<object> {
    try {
      const result = await this.productRepository.findOne({
        where: { id: id },
      });
      if (!result) throw new Error(`Product id ${id} not found`);
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

      products.orderBy('product.id', 'ASC');

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
    const {
      img,
      sku,
      name,
      brand,
      price,
      quantity,
      discription,
      category,
    } = body;
    try {
      const find_product = await this.productRepository.findOne({
        where: { sku: sku },
      });
      if (find_product) throw new Error('sku is duplicate');
      if (quantity <= 0) throw new Error('quantity is negative');
      const product = new Product();

      product.img = img;
      product.sku = sku;
      product.name = name;
      product.brand = brand;
      product.price = price;
      product.quantity = quantity;
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

  async updateProduct(id: number, body: ProductUpdateDto): Promise<any> {
    const { name, brand, price, category, discription, quantity } = body;
    try {
      const find_product = await this.productRepository.findOne({
        where: { id: id },
      });

      if (!find_product) throw new Error('Product not found');

      if (name) {
        find_product.name = name;
      }

      if (brand) {
        find_product.brand = brand;
      }

      if (price) {
        find_product.price = price;
      }

      if (quantity) {
        find_product.quantity = find_product.quantity + quantity;
        // console.log(find_product.quantity + quantity);
      }

      // if (category) {
      //   find_product.category = category;
      // }

      if (discription) {
        find_product.discription = discription;
      }

      await find_product.save();

      return {
        success: true,
        message: 'update success.',
      };
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(id: number): Promise<object> {
    try {
      await this.productRepository.deleteProduct(id);

      return {
        success: true,
        message: `delete id ${id} sucess`,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: error.message,
      });
    }
  }
}
