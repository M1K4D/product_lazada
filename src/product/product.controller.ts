import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getProducts(@Query() query: ProductSearchDto): Promise<object> {
    return await this.productService.getProduct(query);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  async addProduct(@Body() body: ProductCreateDto): Promise<object> {
    return await this.productService.addProduct(body);
  }
}
