import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  constructor(
    email: string,
    lastName: string,
    firstName: string,
    profile_pic: string,
    nationalIDImage: string,
    password :string

  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profile_pic = profile_pic;
    this.nationalIDImage = nationalIDImage;
    this.password = password
  }

  @IsEmail({}, { message: 'Email should be a valid email address' })
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  profile_pic: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  nationalIDImage: string;

  @IsOptional()
  @IsString()
    password: string;

}
