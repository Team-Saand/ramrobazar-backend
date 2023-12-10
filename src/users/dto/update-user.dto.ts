import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  first_name: string;

  @IsOptional()
  @ApiProperty()
  last_name: string;

  @IsOptional()
  @ApiProperty()
  gender: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  date_of_birth: Date;

  @IsOptional()
  @ApiProperty()
  address: string;
}
