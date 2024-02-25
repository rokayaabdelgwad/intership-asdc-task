import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { storageService } from './storage.service';
import { LoggerModule } from '../logger/logger.module';
@Module({
    imports:[LoggerModule],
    providers: [storageService, PrismaService],
})
export class StorageModule {}
