import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { categoryCreateDto } from 'src/dto/category-create.dto';
import { Category } from 'src/entity/category.entity';
import { categoryRepository } from 'src/repository/category.repository';

@Injectable()
export class CateroryService {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async createCate(body: categoryCreateDto) {
    const { name } = body;
    try {
      const find_category = await this.categoryRepository.findOne({
        where: { name: name.replace(/ /g, '') },
      });

      if (!find_category) {
        const catagory = new Category();
        catagory.name = name;
        await catagory.save();
      }
      return {
        sucess: true,
        message: 'add success',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getCate(): Promise<any> {
    const data = this.categoryRepository.getCate();
    return data;
  }
}
