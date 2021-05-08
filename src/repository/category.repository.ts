import { InternalServerErrorException } from '@nestjs/common';
import { Category } from 'src/entity/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class categoryRepository extends Repository<Category> {
  async initCategory() {
    try {
      const find_category = await this.findOne({
        where: { name: 'uncategory' },
      });

      if (!find_category) {
        const catagory = new Category();
        catagory.name = 'uncategory';
        await catagory.save();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
