import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities';
import { Category } from './category.entity';
import { ListingImage } from './listingImage.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ enum: ['new', 'used'] })
  condition: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.listings)
  category: Category;

  @OneToMany(() => ListingImage, (image) => image.listing)
  images: ListingImage[];

  @ManyToOne(() => Users, (user) => user.listings)
  user: Users;

  getImageUrls() {
    if (this.images) {
      return this.images.map((image) => {
        return `/listings/${image.fileName}`;
      });
    }
  }
}
