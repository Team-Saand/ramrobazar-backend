import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { CategoryDto, ListingDto, UpdateListingDto } from './dto';
import { Category, Listing, ListingImage } from './entities';
@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ListingImage)
    private readonly listingImageRepository: Repository<ListingImage>,
  ) {}

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

  async searchListings(query: string = '') {
    const querybuilder = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.user', 'user')
      .leftJoinAndSelect('listing.images', 'images');
    if (query) {
      querybuilder.where('listing.name ILIKE :query', { query: `%${query}%` });
    }

    return querybuilder.getMany();
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getOneCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: ['listings'],
    });

    if (!category) {
      return false;
    }

    return category;
  }

  async createCategory(body: CategoryDto) {
    const category = this.categoryRepository.create(body);

    await this.categoryRepository.save(category);

    return this.getOneCategory(category.id);
  }

  async updateCategory(id: number, body: CategoryDto) {
    const category = await this.getOneCategory(id);

    if (!category) {
      return false;
    }

    await this.categoryRepository.update({ id }, body);

    return this.getOneCategory(id);
  }

  async deleteCategory(id: number) {
    const category = await this.getOneCategory(id);

    if (!category) {
      return false;
    }

    await this.categoryRepository.delete({ id });

    return true;
  }
}
