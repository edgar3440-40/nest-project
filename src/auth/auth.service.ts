import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    console.log(dto);
    let hash;
    if (dto.password) {
      hash = await argon.hash(dto.password as string);
    }

    try {
      if (dto as AuthDto) {
        let user;
        if (dto.role === 'teacher') {
          user = await this.prismaService.teacher.create({
            data: {
              email: dto.email,
              hash,
              role: dto.role as string,
              profileImg: dto.profileImg,
              name: dto.name ? dto.name : null,
            },
          });
        } else {
          user = await this.prismaService.student.create({
            data: {
              email: dto.email,
              hash,
              role: dto.role as string,
              profileImg: dto.profileImg,
              name: dto.name ? dto.name : null,
            },
          });
        }

        return this.signToken(user.id, user.email);
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      console.log(err);
      throw new Error('Something went wrong, please try again later');
    }
  }

  async login(dto: LoginDto) {
    const student = await this.prismaService.student.findUnique({
      where: {
        email: dto.email,
      },
    });
    const teacher = !student
      ? await this.prismaService.teacher.findUnique({
          where: { email: dto.email },
        })
      : null;
    const user = student || teacher;

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    let pwMatches;
    if (user.hash) {
      pwMatches = await argon.verify(user.hash, dto.password as string);
    }

    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    return await this.signToken(user.id, user.email);
  }

  async googleRegister(email: string, role: string, name: string) {
    try {
      let user = await this.prismaService.student.findUnique({
        where: { email },
      });
      if (!user) {
        user = await this.prismaService.student.create({
          data: { email, role, name },
        });
      }

      if (user) {
        return await this.signToken(user.id, user.email);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '360m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { accessToken: token };
  }
}
