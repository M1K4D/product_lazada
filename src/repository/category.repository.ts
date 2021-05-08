import { Category } from 'src/entity/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class categoryRepository extends Repository<Category> {}
