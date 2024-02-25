import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class SocketTokenService {
    constructor(private prisma: PrismaService) {}
    async SocketTokenIsNotExpired(token: string) {
        const res = await this.prisma.expiredTokens.findFirst({
            where:{
                token:token,
                deleted:false
            },
        
        })
        if (!res || res.isExpired) return false;
        return true
    }
}