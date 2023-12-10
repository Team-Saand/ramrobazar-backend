import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(body: CreateUserDto): Promise<Users> {
    const user = this.usersRepository.create(body);
    await this.usersRepository.save(user);
    delete user.password;

    return user;
  }

  async findOneUser(email: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserWithPassword(email: string): Promise<Users> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async updateUser(email: string, body: UpdateUserDto): Promise<Users> {
    const user = await this.findOneUser(email);
    Object.assign(user, body);

    return this.usersRepository.save(user);
  }

  async updateProfilePicture(email: string, filename: string): Promise<Users> {
    const user = await this.findOneUser(email);
    if (user) {
      user.photo_url = filename;

      return this.usersRepository.save(user);
    }
  }
}
