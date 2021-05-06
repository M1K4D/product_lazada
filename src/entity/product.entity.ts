import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ length: 50 })
  brand: string;

  @Column()
  price: number;

  @Column()
  discription: string;

  @CreateDateColumn()
  create_at: Date;
}
