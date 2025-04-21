/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login пользователя' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Sign up пользователя' })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User signup data including profile image upload',
    type: AuthDto,
  })
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: diskStorage({
        destination: './public/uploads/profile',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  signup(@Body() dto: AuthDto, @UploadedFile() file: Express.Multer.File) {
    console.log(dto);
    const imagePath = file ? `/static/uploads/profile/${file.filename}` : null;

    const body = { ...dto, profileImg: imagePath as string };
    // console.log(body);
    return this.authService.signup(body);
  }

  @ApiOperation({ summary: 'Google OAuth авторизация' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: 'Google OAuth редирект и регистрация' })
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    if (req.user.firstName) {
      if(req.user.role === 'student') {
        return await this.authService.googleRegister(
          req.user.email,
          'student',
          req.user.firstName,
        );
      } else if(req.user.role === 'teacher') {
          return await this.authService.googleRegister(
          req.user.email,
          'teacher',
          req.user.firstName,
        );
      }

    }
  }
}
