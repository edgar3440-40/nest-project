import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'URL изображения профиля пользователя',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImg?: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Артем Иванов',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'example@mail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
