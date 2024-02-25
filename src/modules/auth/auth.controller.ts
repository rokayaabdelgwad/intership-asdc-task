import { Body, Controller,Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from 'express';
import { AuthDto } from "./dto";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){ }

    @Post("signup")
    
    signup(@Body () dto:AuthDto){
        
        return this.authService.signup(dto)
    }
    @Post("login")
    signin(@Body () dto:AuthDto){
        
        return  this.authService.signin(dto)
    }

    
}

