import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from '../../listings/entities';
import { GenderEnum } from '../enums';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true, enum: GenderEnum })
  gender: GenderEnum;

  @Column({ nullable: true, type: Date })
  date_of_birth: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  photo_url?: string;

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];
}
