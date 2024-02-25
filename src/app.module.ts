import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { LoggerModule } from './modules/logger/logger.module';
import { StorageModule } from './modules/storage/storage.module';
import { storageService } from './modules/storage/storage.service';
import { SocketGateway } from './modules/socket/socket.gateway';
import { SocketService } from './modules/socket/socket.service';
import { SocketTokenService } from './modules/socket/auth';
@Module({
  imports: [EventEmitterModule.forRoot(),ConfigModule.forRoot({ isGlobal: true }),AuthModule,LoggerModule,StorageModule],
  controllers: [UserController],
  providers: [UserService, PrismaService,storageService ,SocketGateway,SocketService,SocketTokenService],
})
export class AppModule {}
