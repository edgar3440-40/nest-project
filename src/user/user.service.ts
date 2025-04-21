import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserInfo(userId: number) {
    try {
      return await this.checkTheUserType(userId);
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async updateUserInfo(userId: number, dto: UserDto) {
    try {
      const user = await this.checkTheUserType(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Debugging: Check if the role is correctly being assigned
      console.log('User role:', user.role);

      let userModel;
      if (user.role === 'student') {
        userModel = this.prisma.student;
      } else if (user.role === 'teacher') {
        userModel = this.prisma.teacher;
      } else {
        throw new Error('Unknown role');
      }

      const updatedUser = await userModel.update({
        where: { id: userId },
        data: { ...dto },
      });

      delete (updatedUser as { hash?: string }).hash;

      return updatedUser;
    } catch (err) {
      if (err.status === 401) {
        throw new UnauthorizedException('You are not authorized');
      } else if (err.status === 404) {
        throw new NotFoundException(
          'Your info is not found. Please try again later',
        );
      }
    }
  }
  async enrollCourse(courseId: number, userId: number) {
    try {
      const student = await this.checkTheUserType(userId);
      if (student.role === 'student') {
        const updatedCourse = await this.prisma.enrollment.create({
          data: {
            student: { connect: { id: userId } },
            course: { connect: { course_id: courseId } },
          },
          include: {
            course: {
              select: {
                title: true
              }
            }
          }
        });
        return 'The course '  + updatedCourse.course.title + ' is successfully enrolled';
      } else {
        throw new UnauthorizedException(
          'Only students can enroll courses. If you want to enroll courses you should create a new student account',
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUserCourses(userId: number) {
    try {
      const student = await this.checkTheUserType(userId);
      if (student) {
        const userCourses: any = await this.prisma.student.findUnique({
          where: { id: userId },
          include: {
            courses: {
              select: {
                course: true,
              },
            },
          },
        });
        return userCourses;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async checkTheUserType(id: number) {
    // Try to find the user (either student or teacher)
    const student = await this.prisma.student.findUnique({ where: { id } });
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { createdCourses: true },
    });

    // Return the user if found
    const user = student || teacher;
    if (!user) {
      throw new NotFoundException('The user is not found');
    }

    // Remove sensitive data (e.g., hash) if it's a student
    delete (user as { hash?: string }).hash;

    // Return the user object otherwise
    return user;
  }
}
