import { Body, Controller, Get, Post } from '@nestjs/common';
import { categoryCreateDto } from 'src/dto/category-create.dto';
import { categoryRepository } from 'src/repository/category.repository';
import { CateroryService } from './caterory.service';

@Controller('caterory')
export class CateroryController {
  constructor(
    private readonly categoryRepository: categoryRepository,
    private categoryService: CateroryService,
  ) {
    this.categoryRepository.initCategory();
  }

  @Get('getcate')
  async getCate(): Promise<any> {
    return this.categoryService.getCate();
  }

  @Post('add')
  async addCategory(@Body() body: categoryCreateDto) {
    return await this.categoryService.createCate(body);
  }
}
