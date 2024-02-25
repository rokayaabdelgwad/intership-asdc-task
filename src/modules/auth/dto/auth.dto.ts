import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto{
    constructor( email:string, password:string){
        this.email = email;
        this.password = password;
    }
    @IsEmail()
    @IsNotEmpty()
    email:String ;

    @IsString()
    @IsNotEmpty()
    password:String
}