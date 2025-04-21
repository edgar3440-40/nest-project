import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth-guard/auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [],
  exports: [AuthService],
  providers: [AuthService, PrismaService, JwtService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
