import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities';
import { AuthGuard } from './guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [AuthGuard],
})
export class UsersModule {}
