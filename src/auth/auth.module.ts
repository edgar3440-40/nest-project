import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  imports: [AuthService],
})
export class AuthModule {}
