import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { GlobalExceptionFilter } from './filters';
import { ListingsModule } from './listings/listings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./.env.${process.env.NODE_ENV}`,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRES_IN') },
      }),
    }),
    DatabaseModule,
    UsersModule,
    ListingsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [JwtModule],
})
export class AppModule {}
