import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the path if needed
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { LoggerModule } from '../logger/logger.module';
@Module({
  imports: [PrismaModule, JwtModule.register({}),LoggerModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
