import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class CreateUserDto {
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

@IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  middle_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;
}
