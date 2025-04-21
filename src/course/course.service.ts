import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseDto, CourseDtoUpdate } from './dto/course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterDto } from './dto/filter.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { course_id: id },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
            },
          }, // This will populate only the 'createdBy' relation (the teacher who created the course)
        },
      });
      if (!course) {
        throw new NotFoundException('The course is not found');
      }

      return course;
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async getAll(query?: filterDto) {
    try {
      if (query) {
        const {
          page = 1,
          limit = 10,
          sortBy,
          sortOrder = 'asc',
          ...filters
        } = query;

        let orderBy = {};

        if (sortBy) {
          orderBy = {
            [sortBy]: sortOrder,
          };
        }

        const where: any = {};
        for (const key in filters) {
          const value = filters[key];

          if (value !== undefined && value !== null && value !== '')
            where[key] = {
              contains: value,
              mode: 'insensitive',
            };
        }

        let take = +limit > 0 ? +limit : 10;
        let skip = (+page - 1) * take;
        if (isNaN(take) || take < 1) {
          console.log('take is not valid, setting to default 10');
          take = 10;
          skip = (+page - 1) * take;
        }

        // implement error handling

        const [data, total] = await this.prisma.$transaction([
          this.prisma.course.findMany({ where, orderBy, take, skip }),
          this.prisma.course.count({ where }),
        ]);

        const totalPages = Math.ceil(total / take);
        if (page > totalPages) {
          throw new BadRequestException(
            'The page number is you request is greater than th total pages the data can contain. Please try to request in ' +
              totalPages +
              ' pages',
          );
        }

        if (page)
          return {
            data,
            total,
            page: +page,
            totalPages,
          };
      }
      const courses = this.prisma.course.findMany();
      return courses;
    } catch (err) {
      console.error('Error occured: ', err);
      if (err.status === 400) {
        console.log(err);
        throw new BadRequestException(err.message);
      }

      throw new InternalServerErrorException(
        'An unexpected error happened while porcessing your request.',
      );
    }
  }

  async create(dto: CourseDto, userId: number) {
    try {
      console.log(dto);
      const course = await this.prisma.course.create({
        data: {
          ...dto,
          creator_id: userId,
        },
      });
      console.log('Course creation');
      return course;
    } catch (error) {
      console.log(error);
    }
  }

  async update(dto: CourseDtoUpdate, id: number, userId: number) {
    try {
      await this.checkCourseOwnership(id, userId);

      const updatedCourse = await this.prisma.course.update({
        where: { course_id: id },
        data: dto,
      });

      return updatedCourse;
    } catch (err) {
      if (err.status === 401) {
        throw new UnauthorizedException(err.message);
      } else if (err.status === 404) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async delete(id: number, userId: number) {
    try {
      await this.checkCourseOwnership(id, userId);

      await this.prisma.course.delete({
        where: { course_id: id },
      });

      return 'The course is deleted successfully';
    } catch (err) {
      if (err.status === 401) {
        throw new UnauthorizedException(err.message);
      } else if (err.status === 404) {
        throw new NotFoundException(err.message);
      }
    }
  }

  private async checkCourseOwnership(courseId: number, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
    });

    if (!course) {
      throw new NotFoundException('The course is not found');
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: userId },
    });

    if (!teacher || teacher.id !== course.creator_id) {
      throw new UnauthorizedException(
        'Only the creator of the course can change anything',
      );
    }

    return course;
  }
}
