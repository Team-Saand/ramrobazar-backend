import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities';
import { UsersService } from '../users/users.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, UsersService],
})
export class CategoriesModule {}
