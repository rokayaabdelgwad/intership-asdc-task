import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { generateFilename } from '../../utils/imageUpload';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import { LoggerService } from '../logger/logger.service';
import * as multer from 'multer';
import { NationalIDDto } from '../user/dto/nationalId.dto';
// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
@Injectable()
export class storageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {}

  async uploadImage(file: MemoryStorageFile, fieldname: string) {
    try {
        if (!file || !file.buffer) {
            throw new CustomBadRequestException('File or file buffer is missing.');
        }

        const filename = generateFilename(fieldname).toString();
        const uploadPath = path.join(process.cwd(), 'uploads', 'imag', filename);

        // Create directory if it doesn't exist
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        // Asynchronously write file
        await fs.promises.writeFile(uploadPath, Buffer.from(file.buffer));

        const userData = {
            [fieldname]: filename
            // Add other fields as necessary
        };

        // Create user in the database
        const user = await this.prisma.user.create({ data: userData });

        return { [fieldname]: user[fieldname] };
    } catch (error) {
        this.loggerService.logError(error);
        if (error instanceof CustomBadRequestException) {
            throw error; // Re-throw custom bad request exception
        } else {
            throw new InternalServerErrorException(`Error uploading ${fieldname} image`);
        }
    }
}
   async uploadNationalIdImage(file:MemoryStorageFile ){

    return this.uploadImage(file,'nationalID_Image')
  }
  async uploadProfilePicture(file:MemoryStorageFile){
    return this.uploadImage(file,'profile_picture')
  }
}
