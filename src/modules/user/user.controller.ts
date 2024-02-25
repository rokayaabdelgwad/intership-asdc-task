import {
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { UserDto } from './dto/user.auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NationalIDDto } from './dto/nationalId.dto';
import { storageService } from '../storage/storage.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { profile } from 'console';
// @UseGuards(JwtGuard) for  Authorized
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadImage: storageService,
  ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post('create-user')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nationalID_Image', maxCount: 1 },
        { name: 'profile_picture', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: 'upload/img',
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          },
        }),
      },
    ),
  )
  async createUser(
    @Body() dto: UserDto,
    @UploadedFiles() files: { nationalID_Image?: Express.Multer.File[], profile_picture?: Express.Multer.File[] },
  ) {
    const {  nationalID_Image, profile_picture } = files;
    return this.userService.createUser(dto, nationalID_Image[0], profile_picture[0]);
  }

  @Get('get-all-users')
  @ApiOperation({ summary: 'Get all users from this api' })
  @ApiResponse({ status: 200, description: 'All users List ' })
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('get-user/:id')
  findOneUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() bodyData: UpdateUserDto) {
    return this.userService.update(parseInt(id, 10), bodyData);
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(parseInt(id, 10));
  }
  /////////////////////////////////////////////////////

  ////////////////////////////////////////////////
  //   @Post('upload-profile-picture')
  //   @UseInterceptors(
  //     FileInterceptor('file', {
  //       storage: diskStorage({
  //         destination: 'uploads/img',
  //         filename: (req, file, cb) => {
  //           cb(null, file.originalname);
  //         },
  //       }),
  //     }),
  //   )
  //   uploadProfilePicture(
  //     @UploadedFile(
  //       new ParseFilePipe({
  //         validators: [
  //           new MaxFileSizeValidator({ maxSize: 200000 }),
  //           new FileTypeValidator({ fileType: 'image/jpeg' }),
  //         ],
  //       }),
  //     )
  //     file: Express.Multer.File,
  //   ) {
  //     return this.uploadImage.uploadProfilePicture(file);
  //   }
}
