import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @ApiProperty()
  name: string;
}
