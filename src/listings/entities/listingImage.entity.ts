import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity()
export class ListingImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @ManyToOne(() => Listing, (listing) => listing.images)
  listing: Listing;
}
