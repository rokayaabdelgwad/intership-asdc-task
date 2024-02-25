
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    constructor(email: string,lastName:string ,firstName: string ){
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
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


 

}



    

