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
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { ProductCreateDto } from 'src/dto/product-create.dto';
import { ProductSearchDto } from 'src/dto/product-search.dto';
import { ProductUpdateDto } from 'src/dto/product.update.dto';
import { ProductService } from './product.service';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

export const storage = {
  storage: diskStorage({
    destination: './uploads/img',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extention: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extention}`);
    },
  }),
};

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

  @Post('uploadimage')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', storage))
  uploadfile(@UploadedFile() file): Observable<object> {
    // console.log(file);
    return of({ imagePath: file.filename });
  }

  @Get('product-img/:imgname')
  getImgProduct(@Param('imgname') imgname, @Res() res): Observable<object> {
    return of(res.sendFile(join(process.cwd(), '/uploads/img/' + imgname)));
  }
}
