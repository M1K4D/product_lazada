import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  sku_id: string;

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

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
