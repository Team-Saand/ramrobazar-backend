import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities';
import { UsersService } from '../users/users.service';
import { Listing } from './entities';
import { ListingImage } from './entities/listingImage.entity';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, ListingImage, Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [ListingsController],
  providers: [ListingsService, UsersService],
})
export class ListingsModule {}
