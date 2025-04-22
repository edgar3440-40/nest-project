import {
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class filterDto {

  @ApiProperty({
    required: false,
    description: 'Поле, по которому производится сортировка',
    example: 'price',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    required: false,
    description: 'Порядок сортировки: по возрастанию (asc) или убыванию (desc)',
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;

  @ApiProperty({
    required: false,
    description: 'Номер страницы (начиная с 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Максимальное количество элементов на странице (от 1 до 10)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  limit?: number;

  @ApiProperty({
    required: false,
    description: 'Поиск по названию курса',
    example: 'Французский для начинающих',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Фильтрация курсов по языку',
    example: 'Hebrew',
  })
  @IsOptional()
  @IsString()
  language?: string;
}
