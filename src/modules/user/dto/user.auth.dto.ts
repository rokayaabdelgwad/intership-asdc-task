
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

	@IsString()
    @IsNotEmpty()
    public password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
