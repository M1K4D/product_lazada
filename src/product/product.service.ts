import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { ProductUpdateDto } from 'src/dto/product.update.dto';
import { Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { categoryRepository } from 'src/repository/category.repository';
import { ProductRepository } from 'src/repository/product.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: categoryRepository,
  ) {}

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
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.category', 'category');

      if (sku) {
        products.andWhere('product.sku ilike :sku', { sku: `%${sku}%` });
      }

      if (name) {
        products.andWhere('product.name ilike :name', { name: `%${name}%` });
      }

      if (brand) {
        products.andWhere('product.brand ilike :brand', {
          brand: `%${brand}%`,
        });
      }

      products.orderBy('product.id', 'ASC');

      const result = await products.getRawMany();

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

  async addProduct(body: ProductCreateDto): Promise<object> {
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
      const find_category = await this.categoryRepository.findOne({
        where: { name: category },
      });
      if (find_product) throw new Error('sku is duplicate');

      if (quantity <= 0) throw new Error('quantity is negative');
      const product = new Product();

      if (find_category) {
        product.category = find_category;
      } else {
        const newCategory = new Category();
        newCategory.name = category;
        newCategory.save();
        product.category = newCategory;
      }

      product.img = img;
      product.sku = sku.replace(/ /g, '');
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

  async updateProduct(id: number, body: ProductUpdateDto): Promise<object> {
    const { name, brand, price, category, discription, quantity } = body;
    try {
      const find_product = await this.productRepository.findOne({
        where: { id: id },
      });

      if (!find_product) throw new Error('Product not found');

      if (name) {
        find_product.name = name.replace(/ /g, '');
      }

      if (brand) {
        find_product.brand = brand;
      }

      if (price) {
        find_product.price = price;
      }

      if (quantity) {
        find_product.quantity = find_product.quantity + quantity;
      }

      if (category) {
        const find_category = await this.categoryRepository.findOne({
          where: { name: category },
        });
        if (find_category) {
          find_product.category = find_category;
        } else {
          const newCategory = new Category();
          newCategory.name = category;
          newCategory.save();
          find_product.category = newCategory;
        }
      }

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
