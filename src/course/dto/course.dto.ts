import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CourseDto {
  @ApiProperty({
    example: 'Английский',
    description: 'Язык, на котором проводится курс',
  })
  @IsString()
  language: string;

  @ApiProperty({
    example: 'Английский для начинающих',
    description: 'Название курса',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 199.99,
    description: 'Стоимость курса в валюте',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'https://example.com/course-image.jpg',
    description: 'Ссылка на главное изображение курса',
  })
  @IsString()
  mainImg: string;
}

export class CourseDtoUpdate {
  @ApiProperty({
    example: 'Французский',
    description: 'Новый язык курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    example: 'Французский для продвинутых',
    description: 'Новое название курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 299.99,
    description: 'Новая цена курса',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 'https://example.com/new-course-image.jpg',
    description: 'Новое изображение курса',
    required: false,
  })
  @IsOptional()
  @IsString()
  mainImg?: string;

}
