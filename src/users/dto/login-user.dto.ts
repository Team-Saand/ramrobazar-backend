import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('NP', { message: 'Only nepali numbers are allowed' })
  @Matches(/^\+977\d{10}$/, {
    message: 'Phone number should contain 10 digits',
  })
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
