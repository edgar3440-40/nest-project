import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'edgar19@gmail.com',
    description: 'Электронная почта пользователя для входа или регистрации',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'hello-3440',
    description: 'Пароль пользователя. Обязателен при регистрации',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'student',
    description: 'Роль пользователя: student или teacher',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role?: string;

  @ApiProperty({
    example: 'Эдгар',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Ссылка на изображение профиля пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImg?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}

export class LoginDto {
  @ApiProperty({
    example: 'edgar19@gmail.com',
    description: 'Электронная почта пользователя для входа или регистрации',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'hello-3440',
    description: 'Пароль пользователя. Обязателен при регистрации',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
