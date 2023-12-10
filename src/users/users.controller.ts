import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { successResponse } from '../utils';
import { CreateUserDto, UpdateUserDto } from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guard';
import { AuthRequest } from './types';
import { UsersService } from './users.service';

@ApiTags('Authentication')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiOperation({ summary: 'Register an account' })
  async register(@Body() body: CreateUserDto, @Req() request: Request) {
    if (body.password !== body.confirm_password) {
      throw new BadRequestException('Passwords donot match');
    }

    const foundUser = await this.usersService.findOneUser(body.phone);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    body.password = await this.usersService.hashPassword(body.password);
    const user = await this.usersService.createUser(body);

    const payload = { id: user.id, email: user.email, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);

    return successResponse(accessToken, 'User registered successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'Login with credentials' })
  async login(@Body() body: LoginUserDto) {
    const user = await this.usersService.getUserWithPassword(body.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password!');
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const payload = { id: user.id, phone: user.phone, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return successResponse(accessToken, 'User logged in successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  async getProfile(@Req() request: AuthRequest) {
    const user = await this.usersService.findOneUser(request.user.phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return successResponse(user, 'Profile fetched successfully!');
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/profile-picture')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload your profile picture' })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: path.join(
          __dirname,
          '..',
          '..',
          'public',
          'profile-pictures',
        ),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = path.extname(file.originalname);
          cb(null, uniqueSuffix + extension);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @Req() request: AuthRequest,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    if (!picture) {
      throw new BadRequestException('Profile picture not provided');
    }

    const filename = `/profile-pictures/${picture.filename}`;
    const user = await this.usersService.updateProfilePicture(
      request.user.phone,
      filename,
    );

    return successResponse(user, 'Profile picture uploaded successfully!');
  }

  @HttpCode(HttpStatus.OK)
  @Put('/update-profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  async updateProfile(
    @Req() request: AuthRequest,
    @Body() userDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(
      request.user.phone,
      userDto,
    );

    return successResponse(updatedUser, 'Profile updated successfully!');
  }
}
