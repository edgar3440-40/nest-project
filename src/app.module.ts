import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, JwtModule, ConfigModule.forRoot({ isGlobal: true}), CourseModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AppModule {}
