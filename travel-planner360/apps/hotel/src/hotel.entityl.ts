import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column()
  rating!: number;

  @Column()
  pricePerNight!: number;

  @Column({ type: 'time' })
  checkInEndTime!: string;

}
