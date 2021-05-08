import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ length: 50 })
  category: string;

  @CreateDateColumn()
  create_at: Date;
}
