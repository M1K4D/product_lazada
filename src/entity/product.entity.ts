import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ length: 50 })
  brand: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  discription: string;

  @CreateDateColumn()
  create_at: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
