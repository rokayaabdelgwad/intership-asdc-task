import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from '../auth/dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';
import { CustomBadRequestException } from '../../utils/custom.exceptions';
import { LoggerService } from '../../modules/logger/logger.service';
import { storageService } from '../storage/storage.service';
import { NationalIDDto } from './dto/nationalId.dto';
import { UserDto } from './dto/user.auth.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
    private readonly uploadImage: storageService,
  ) {}
  async createUser(
    dto:  UserDto,
    nationalIDImage?: Express.Multer.File,
    profile_pic?: Express.Multer.File,
) {
    try {

      

             // Validate AuthDto properties
             if (!dto || !dto.email || !dto.password) {
              throw new NotFoundException('Invalid UserDto object');
          }
        const email = dto.email.toString();
        const hash = await argon.hash(dto.password.toString());
 
        // Check if a user with the provided email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new NotFoundException(
                `User with email ${email} already exists`,
            );
        }

          

        // Create the new user if no user with the provided email exists
        const addedUser = await this.prisma.user.create({
            data: {
                email: email,
                hash: hash,
            },
        });

        // Upload profile picture
        const profilePic = await this.uploadImage.uploadProfilePicture(profile_pic);
        addedUser.profile_pic = profilePic.profile_pic;
        await this.prisma.user.update({
            where: { id: addedUser.id },
            data: { profile_pic: profilePic.profile_pic },
        });

        // Upload national ID image
        const nationalIdImage = await this.uploadImage.uploadNationalIdImage(nationalIDImage);
        addedUser.nationalIDImage = nationalIdImage.nationalIDImage;
        await this.prisma.user.update({
            where: { id: addedUser.id },
            data: { nationalIDImage: nationalIdImage.nationalIDImage },
        });

        if (addedUser.hasOwnProperty('hash')) {
            delete (addedUser as any).hash;
        }
        return addedUser;
    } catch (error) {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error creating user');
    }
}


  async findAllUsers() {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      if(error instanceof NotFoundException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
      this.loggerService.logError(error);
      throw new InternalServerErrorException('Error finded  users');
    }
  }}

  async findOne(id: number) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return existingUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error finded   user');
      }
    }
  }

  async update(id: number, userData: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.prisma.user.update({
        // lastName:userData.lastName?userData.lastName:existingUser.lastName
        where: { id },
        data: {
          email: userData.email ? userData.email : existingUser.email,
          firstName: userData.firstName
            ? userData.firstName
            : existingUser.firstName,
          lastName: userData.lastName
            ? userData.lastName
            : existingUser.lastName,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        console.error('Error updating user:', error);
        throw new InternalServerErrorException('Error updated user');
      }
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        console.log(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error deleted user');
      }
    }
  }
}
