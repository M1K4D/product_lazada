import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { ProductUpdateDto } from 'src/dto/product.update.dto';
import { ProductService } from './product.service';

@Controller('product')
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getProducts(@Query() query: ProductSearchDto): Promise<object> {
    return await this.productService.getProduct(query);
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.productService.getProductById(id);
  }

  @Post('create')
  async addProduct(@Body() body: ProductCreateDto): Promise<object> {
    return await this.productService.addProduct(body);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProductUpdateDto,
  ): Promise<object> {
    return await this.productService.updateProduct(id, body);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.productService.deleteProduct(id);
  }
}
