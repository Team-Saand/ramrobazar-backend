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
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthGuard } from 'src/users/guard';
import { AuthRequest } from 'src/users/types';
import { successResponse } from 'src/utils';
import { ListingDto, QueryDto, UpdateListingDto } from './dto';
import { ListingsService } from './listings.service';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all listings' })
  async getAllListings(@Query() params: QueryDto) {
    const data = await this.listingsService.searchListings(params.name);

    const listings = data.map((listing) => ({
      ...listing,
      images: listing.getImageUrls(),
    }));

    return successResponse(listings, 'Listings fetched successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get one listing' })
  async getOneListing(@Param('id') id: number) {
    const listing = await this.listingsService.getOneListing(id);
    if (!listing) {
      throw new BadRequestException('Listing not found');
    }

    return successResponse(
      { ...listing, images: listing.getImageUrls() },
      'Listing fetched successfully!',
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', 'public', 'listings'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, uniqueSuffix + extension);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a listing' })
  async createListing(
    @Body() body: ListingDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() request: AuthRequest,
  ) {
    if (images.length === 0) {
      throw new BadRequestException('Images not provided');
    }

    const filenames = images.map((image) => {
      return image.filename;
    });

    const listing = await this.listingsService.createListing(
      body,
      filenames,
      request.user.id,
    );

    return successResponse(listing, 'Listing created successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a listing' })
  async updateListing(
    @Param('id') id: number,
    @Body() body: UpdateListingDto,
    @Request() request: AuthRequest,
  ) {
    const listing = await this.listingsService.updateListing(
      id,
      body,
      request.user.id,
    );

    if (!listing) {
      throw new BadRequestException('Listing not found');
    }

    return successResponse(
      { ...listing, images: listing.getImageUrls() },
      'Listing updated successfully!',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a listing' })
  async deleteListing(
    @Param('id') id: number,
    @Request() request: AuthRequest,
  ) {
    const listing = await this.listingsService.deleteListing(
      id,
      request.user.id,
    );

    if (!listing) {
      throw new BadRequestException('Listing not found');
    }

    return successResponse(true, 'Listing deleted successfully!');
  }
}
