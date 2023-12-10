import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('NP', { message: 'Only nepali numbers are allowed' })
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
