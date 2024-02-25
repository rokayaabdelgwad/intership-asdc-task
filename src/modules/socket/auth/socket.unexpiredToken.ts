import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomForbiddenException } from 'src/utils/custom.exceptions';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Socket } from 'socket.io';
@Injectable()
export class SocketAuthorizeUnexpiredTokens implements CanActivate {
    constructor(private reflector ,private prisma:PrismaService){}

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest() as Socket; 
        const token: string = (request.handshake.headers['jwt_token'] as string).split(' ')[1];
        const res =await this.prisma.expiredTokens.findFirst({
            where:{
                token:token,
                deleted:false
            }
        });
        if (res && res.isExpired) throw new CustomForbiddenException('This Token Is Expired');

		return true;
}}