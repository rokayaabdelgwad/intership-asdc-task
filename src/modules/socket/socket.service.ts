import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { handleException } from "src/utils/error.handler";
import { LoggerService } from "../logger/logger.service";
import { User } from "@prisma/client";
@Injectable()
export class SocketService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly loggerService: LoggerService,
	) {}

async updateStatus (user_id:number ,status:string){
    if (user_id <= 0 || user_id == null || user_id == undefined || !user_id) return;
    try{
        const user =await this.prisma.user.findFirst({
            where:{id:user_id,
            }
        })
        if(user){
            await this.prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    status:status
                }
            })
        }
    }catch (error) {
    handleException(error, false, { user_id, status });
}
}
async getUser(userId:number ):Promise<User | null>{
    try{
        return await this.prisma.user.findFirst({
            where:{
                id:userId
            }
        })
    } catch(error){
        this.loggerService.logError(error);
        handleException(error,false,{userId})
        return null
    }
} 

}