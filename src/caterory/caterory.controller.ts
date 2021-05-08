import { Controller } from '@nestjs/common';
import { categoryRepository } from 'src/repository/category.repository';

@Controller('caterory')
export class CateroryController {
  constructor(private readonly categoryRepository: categoryRepository) {
    this.categoryRepository.initCategory();
  }
}
