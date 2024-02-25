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

  async uploadImage(file:MemoryStorageFile,data:any, fieldname:string){
    const filename=generateFilename(fieldname).toString()
    const uploadPath=path.join(process.cwd(),'upload','imag',filename)
    try{
        if(!fs.existsSync(path.dirname(uploadPath))){
            fs.mkdirSync(path.dirname(uploadPath),{recursive:true})
        }
        const userDate={...data,[fieldname]:filename}
        const user=await this.prisma.user.create({data:userDate})
        return {[fieldname]:user[fieldname]}
    }catch(error) {
        this.loggerService.logError(error);
        throw new InternalServerErrorException(`Error uploading ${fieldname} image`);
    }

  }
   async uploadNationalIdImage(file:MemoryStorageFile){

    return this.uploadImage(file,{},'nationalIDImage')
  }
  async uploadProfilePicture(file:MemoryStorageFile){
    return this.uploadImage(file,{},'profile_pic')
  }
}
