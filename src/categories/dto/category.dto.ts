import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Category name' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Category description' })
  description: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
