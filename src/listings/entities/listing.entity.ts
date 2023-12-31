import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities';
import { Users } from '../../users/entities';
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

  @ManyToOne(() => Category, (category) => category.listings, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @OneToMany(() => ListingImage, (image) => image.listing, {
    onDelete: 'SET NULL',
  })
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
