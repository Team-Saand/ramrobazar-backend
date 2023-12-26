import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { id: 'ASC' } });
  }

  async getOneCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: ['listings'],
      order: {
        id: 'ASC',
      },
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

  async updateCategory(id: number, body: UpdateCategoryDto) {
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
