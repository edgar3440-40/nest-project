import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth-guard/auth.guard';
import { UserService } from './user.service';
import { User } from 'src/auth/decorator/get-user.decorator';
import { UserDto } from './dto/user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Protected')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @Get('my-info')
  getUserInfo(@User('id') userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @ApiOperation({
    summary: 'Получить список курсов, на которые записан пользователь',
  })
  @Get('my-courses')
  getUserCourses(@User('id') userId: number) {
    return this.userService.getUserCourses(userId);
  }

  @ApiOperation({ summary: 'Обновить информацию о пользователе' })
  @Patch('update-my-info')
  updateUserInfo(@User('id') userId: number, @Body() dto: UserDto) {
    console.log(dto);
    return this.userService.updateUserInfo(userId, dto);
  }

  @ApiOperation({ summary: 'Записаться на курс по ID' })
  @ApiParam({
    name: 'course_id',
    type: Number,
    description: 'ID курса для записи',
  })
  @Patch('enroll-course/:course_id')
  enrollCourse(
    @Param('course_id') courseId: number,
    @User('id') userId: number,
  ) {
    return this.userService.enrollCourse(courseId, userId);
  }
}
