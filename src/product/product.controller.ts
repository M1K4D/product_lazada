import { Controller, Get } from '@nestjs/common';

@Controller('product')
export class ProductController {
  @Get('')
  testGet(): string {
    return 'test get';
  }
}
