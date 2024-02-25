import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserIdentifierObject {
    constructor(email:string){ this.email = email; }
	@ApiProperty({ example: 'John@Company.com' })
	@IsNotEmpty()
	@IsEmail()
	email: string;
}

