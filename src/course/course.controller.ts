import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto, CourseDtoUpdate } from './dto/course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth-guard/auth.guard';
import { User } from 'src/auth/decorator/get-user.decorator';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { filterDto } from './dto/filter.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('courses')
export class CourseController {
  constructor(private courseSerivce: CourseService) {}

  @ApiTags('Protected')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Создать новый курс (только для преподавателей)' })
  create(@Body() dto: CourseDto, @User() user: AuthDto) {
    if (user) {
      console.log(user);
    } else {
      console.log('No user');
    }
    if (user.role === 'teacher') {
      return this.courseSerivce.create(dto, user.id as number);
    } else {
      throw new ForbiddenException(
        'You do not have permission to create a course',
      );
    }
  }
  @Get(':id')
  @ApiOperation({ summary: 'Получить курс по ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.courseSerivce.getById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все курсы с фильтрацией и пагинацией' })
  getAll(@Query() query?: filterDto) {
    if (query) {
      return this.courseSerivce.getAll(query);
    }
    return this.courseSerivce.getAll();
  }

  @ApiOperation({
    summary: 'Обновить данные курса по ID (только для создателя)',
  })
  @ApiTags('Protected')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Body() dto: CourseDtoUpdate,
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    return this.courseSerivce.update(dto, id, userId);
  }

  @ApiOperation({ summary: 'Удалить курс по ID' })
  @ApiTags('Protected')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number, @User('id') userId: number) {
    return this.courseSerivce.delete(id, userId);
  }
}
