import { WebSocketGateway ,WebSocketServer,SubscribeMessage,OnGatewayConnection ,OnGatewayDisconnect} from "@nestjs/websockets";
import { Socket ,Server } from "socket.io"; 
import { SocketService } from "./socket.service";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from "@prisma/client";
import { SocketTokenService } from "./auth";
import { handleException } from "src/utils/error.handler";
import { checkUserStatusPayload ,loggingOutAlert,serverAlert } from "./payloads"; 

@WebSocketGateway({
    cors: {
		origin: 'http://localhost',
		methods: ['GET', 'POST'],
		allowedHeaders: ['Authorization','Postman-Token',  'Content-Type', 'Content-Length', 'Host' ,'User-Agent','Accept','Accept-Encoding','Accept-Encoding','Connection'],
	},
    namespace:'socket_server '
})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private users=[];
    private count=0;
    constructor(
		private readonly socketService: SocketService,
		private readonly eventEmitter: EventEmitter2,
		private tokenService: SocketTokenService,
	) {
        this.eventEmitter.on('serverAlert',(payload:serverAlert)=>{
            const users=[...payload.users.filter((user)=>user !=null)];
            delete payload.users;
            users.forEach((user:User)=>{
                this.server.emit(`serverAlert_${user.id}`,payload)
            });
        })
        this.eventEmitter.on('loggingOutAlert',(payload:loggingOutAlert)=>{
            this.server.emit(`loggingOutAlert_${payload.user_id}`,payload)
        })
    }
    @WebSocketServer() 
    server:Server
    async handleConnection(client: Socket) {
        try{
            const tokenHeader=client.handshake.headers['authorization'] as string;
            if(!tokenHeader) return client.disconnect(true)
            const tokenArray = tokenHeader.split(' ');
            if (tokenArray.length !== 2) return client.disconnect(true) ;
            const token=tokenArray[1];
            const expRes=await this.tokenService.SocketTokenIsNotExpired(token);
            if (!expRes){
                return client.disconnect(true) ;
            }
            const userId=client.handshake.query.user_id;
            this.count++;
            if(userId && userId !=null && userId!=undefined){
                this.socketService.updateStatus(+userId,'online')
            }
        }catch(error){
            handleException(error,false,client.handshake)
        }
    }
    async handleDisconnect(client: Socket) {
		try {
			const userId = client.handshake.query.user_id;
			if (userId) {
				this.socketService.updateStatus(+userId, 'offline');
			}
		} catch (error) {
			handleException(error, false, client.handshake);
		}
	}
@SubscribeMessage('checkUserStatus')
async handleCheckUserStatus(client:Socket ,payload:checkUserStatusPayload){
    try{
        const {user_id}=payload;
        const user=await this.socketService.getUser(user_id);
        if(user){
            client.emit('userStatus',{user_id ,status:user.status})
        }else{
            client.emit('userStatus',{user_id,status:'unknown user'})
        }
    }catch (error) {
        handleException(error, false, client.handshake);
    }

}

    

}