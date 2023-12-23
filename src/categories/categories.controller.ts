import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../users/guard';
import { successResponse } from '../utils';
import { CategoriesService } from './categories.service';
import { CategoryDto, UpdateCategoryDto } from './dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all categories' })
  async getAllCategories() {
    const categories = await this.categoriesService.getAllCategories();

    return successResponse(categories, 'Categories retrieved successfully');
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get one category' })
  async getOneCategory(@Param('id') id: number) {
    const category = await this.categoriesService.getOneCategory(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return successResponse(category, 'Category fetched successfully!');
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a category' })
  async createCategory(@Body() body: CategoryDto) {
    const category = await this.categoriesService.createCategory(body);

    return successResponse(category, 'Category created successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a category' })
  async updateCategory(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(id, body);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return successResponse(category, 'Category updated successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a category' })
  async deleteCategory(@Param('id') id: number) {
    const category = await this.categoriesService.deleteCategory(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return successResponse(true, 'Category deleted successfully!');
  }
}
