import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        // D:\Projects\intership asdc\intership-asdc-task2\error
        const logDirectory = 'D:\\Projects\\intership asdc\\intership-asdc-task4\\error'; 
        return new LoggerService(logDirectory);
      },
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
