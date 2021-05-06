import { Injectable } from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { Product } from 'src/entity/product.entity';
import { ProductRepository } from 'src/repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async addProduct(body: ProductCreateDto): Promise<any> {
    const { sku, name, brand, price, quantity, discription } = body;
    const find_product = await this.productRepository.findOne({
      where: { sku: sku },
    });

    const product = new Product();

    product.sku = sku;
    product.name = name;
    product.brand = brand;
    product.price = price;
  }
}
