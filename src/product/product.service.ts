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
const fs = require('fs');
import { join, parse } from 'path';

import * as request from 'request';
import { promisify } from 'util';

const Fetch = promisify(request);

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: categoryRepository,
  ) {}

  async createLazada(xml): Promise<any> {
    const option = {
      method: 'POST',
      url: 'http://localhost:3002/rest/create',
      body: xml,
      json: true,
    };

    const res = await Fetch(option);
    const body = res.body;
    // console.log(_body);
    return body;
  }

  async updateLazada(xml): Promise<any> {
    const option = {
      method: 'PUT',
      url: 'http://localhost:3002/rest/update',
      body: xml,
      json: true,
    };

    const res = await Fetch(option);
    const body = res.body;
    return body;
  }

  async deleteLazada(skuid): Promise<any> {
    const option = {
      method: 'DELETE',
      url: `http://localhost:3002/rest/delete/${skuid}`,
    };

    const res = await Fetch(option);
    const body = res.body;
    return body;
  }

  async deleteImg(imgname) {
    try {
      const path = join(__dirname, '..', '..', './uploads/img/', imgname);
      fs.unlinkSync(path);
      //file removed
      return {
        success: true,
        message: 'delete img success',
      };
    } catch (err) {
      console.error(err);
    }
  }

  async readFile() {
    fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  }

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

      if (category) {
        products.andWhere('category.name ilike :category', {
          category: `%${category}%`,
        });
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
        where: { sku: sku.replace(/ /g, '') },
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

      const xmlBody = {
        Request: {
          Product: {
            PrimaryCategory: '6614',
            SPUId: '',
            AssociatedSku: '',
            Attributes: {
              name: name,
              short_description: discription,
              brand: brand,
              model: 'asdf',
              kid_years: 'Kids (6-10yrs)',
              delivery_option_sof: 'Yes',
            },
            Skus: {
              Sku: {
                SellerSku: sku,
                color_family: 'Green',
                size: '40',
                quantity: quantity,
                price: price,
                package_length: '11',
                package_height: '22',
                package_weight: '33',
                package_width: '44',
                package_content: "this is what's in the box",
                Images: {
                  Image: [
                    'http://sg.s.alibaba.lzd.co/original/59046bec4d53e74f8ad38d19399205e6.jpg',
                    'http://sg.s.alibaba.lzd.co/original/179715d3de39a1918b19eec3279dd482.jpg',
                  ],
                },
              },
            },
          },
        },
      };

      const res = await this.createLazada(xmlBody);
      console.log(res.data.sku_list[0]);

      product.discription = discription;
      const sku_id = res.data.sku_list[0].sku_id;
      product.sku_id = sku_id;
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

      const xmlBody = {
        Request: {
          Product: {
            ItemId: '234234234',
            Attributes: {
              name: name,
              short_description: discription,
              delivery_option_sof: 'Yes',
              '#comment':
                'should be set as \u2018Yes\u2019 only for products to be delivered by seller',
            },
            Skus: {
              Sku: [
                {
                  SkuId: '234',
                  SellerSku: 'api-create-test-1',
                  quantity: quantity,
                  price: price,
                  package_length: '12',
                  package_height: '23',
                  package_weight: '34',
                  package_width: '45',
                  Images: '',
                },
                {
                  SkuId: '235',
                  SellerSku: 'api-create-test-2',
                  quantity: quantity,
                  price: price,
                  package_length: '10',
                  package_height: '21',
                  package_weight: '32',
                  package_width: '43',
                  package_content: "this is what's in the box, update",
                  Images: {
                    Image: [
                      'http://sg.s.alibaba.lzd.co/original/59046bec4d53e74f8ad38d19399205e6.jpg',
                      'http://sg.s.alibaba.lzd.co/original/179715d3de39a1918b19eec3279dd482.jpg',
                      'http://sg.s.alibaba.lzd.co/original/e2ae2b41afaf310b51bc5764c17306cd.jpg',
                    ],
                  },
                },
              ],
            },
          },
        },
      };

      const res = await this.updateLazada(xmlBody);
      console.log(res);

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
      const find_product = await this.productRepository.findOne({
        where: { id: id },
      });
      await this.productRepository.deleteProduct(id);
      const sku_id = find_product.sku_id;
      console.log('sku_id', sku_id);
      const res = await this.deleteLazada(sku_id);
      console.log(res);

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
