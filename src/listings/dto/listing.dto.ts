import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ListingDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Listing name' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Listing price' })
  price: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Listing description' })
  description: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Listing category id' })
  categoryId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'Listing location' })
  location: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Listing condition', enum: ['new', 'used'] })
  condition: 'new' | 'used';
}

export class UpdateListingDto extends PartialType(ListingDto) {}
