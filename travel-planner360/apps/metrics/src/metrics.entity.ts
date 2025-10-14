 import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Metrics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  version!: string; 

  @Column({ default: 0 })
  count!: number;
}