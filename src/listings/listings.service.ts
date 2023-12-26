import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ILike, Repository } from 'typeorm';
import { ListingDto, UpdateListingDto } from './dto';
import { Listing, ListingImage } from './entities';
@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingImage)
    private readonly listingImageRepository: Repository<ListingImage>,
  ) {}

  async searchListings(query: string = '') {
    return this.listingRepository.find({
      where: query ? { name: ILike(`%${query}%`) } : {},
      relations: ['category', 'user', 'images'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          photo_url: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async getOneListing(id: number): Promise<false | Listing> {
    const listing = await this.listingRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'user', 'images'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          photo_url: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });

    if (!listing) {
      return false;
    }

    return listing;
  }

  async getOwnListing(id: number, userId: number): Promise<false | Listing> {
    const listing = await this.listingRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['category', 'user', 'images'],
      order: {
        id: 'ASC',
      },
    });

    if (!listing) {
      return false;
    }

    return listing;
  }

  async createListing(
    body: ListingDto,
    filenames: string[],
    userId: number,
  ): Promise<false | Listing> {
    const { categoryId, ...rest } = body;

    const images = await Promise.all(
      filenames.map(async (filename) => {
        const image = this.listingImageRepository.create({
          fileName: filename,
        });
        await this.listingImageRepository.save(image);
        return image;
      }),
    );

    const listing = this.listingRepository.create({
      ...rest,
      category: { id: categoryId },
      images,
      user: { id: userId },
    });

    await this.listingRepository.save(listing);

    return this.getOneListing(listing.id);
  }

  async updateListing(id: number, body: UpdateListingDto, userId: number) {
    const listing = await this.getOwnListing(id, userId);

    const { categoryId, ...rest } = body;

    if (!listing) {
      return false;
    }

    await this.listingRepository.update(
      { id },
      { ...rest, category: { id: categoryId || listing.category.id } },
    );

    return this.getOneListing(id);
  }

  async deleteListing(id: number, userId: number) {
    const listing = await this.getOwnListing(id, userId);

    if (!listing) {
      return false;
    }

    try {
      const publicFolder = path.join(__dirname, '..', '..', 'public');
      listing.images.forEach((image) => {
        fs.unlinkSync(path.join(publicFolder, 'listings', image.fileName));
      });
    } catch (error) {
      console.error('Error deleting file');
    }

    await this.listingRepository.delete({ id });

    return true;
  }

  async getListingByCategory(categoryId: number) {
    return this.listingRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
      relations: ['category', 'user', 'images'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          photo_url: true,
        },
      },
    });
  }
}
