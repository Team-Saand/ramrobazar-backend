import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto, ListingDto, UpdateListingDto } from './dto';
import { Category, Listing } from './entities';
import { ListingImage } from './entities/listingImage.entity';

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

  async getAllListings(): Promise<Listing[]> {
    return this.listingRepository.find({
      relations: ['category', 'user', 'images'],
    });
  }

  async getOneListing(id: number): Promise<false | Listing> {
    const listing = await this.listingRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'user', 'images'],
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

    if (!listing) {
      return false;
    }

    await this.listingRepository.update({ id }, body);

    return this.getOneListing(id);
  }

  async deleteListing(id: number, userId: number) {
    const listing = await this.getOwnListing(id, userId);

    if (!listing) {
      return false;
    }

    await this.listingRepository.delete({ id });

    return true;
  }

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
