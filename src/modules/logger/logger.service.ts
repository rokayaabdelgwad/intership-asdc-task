import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

@Injectable()
export class LoggerService {
  constructor(private readonly logDirectory: string) {}

  logError(error: Error) {
    const timestamp = moment().format('YYYY-MM-DD_hh-mm-ss A'); // Use 'hh' for 12-hour hours and 'A' for AM/PM
    const logMessage = `[${timestamp}] Error: ${error.message}\nStack Trace: ${error.stack}\n\n`;

    // Ensure the log directory exists, if not, create it
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    // Construct the log file path using the current date
    const logFilePath = path.join(this.logDirectory, `error_${moment().format('YYYY-MM-DD')}.log`);

    // Append the log message to the log file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  }
}
