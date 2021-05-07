import { Product } from 'src/entity/product.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async deleteProduct(id: number) {
    await this.createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :id', { id: id })
      .execute();
  }
}
