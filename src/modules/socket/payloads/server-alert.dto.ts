import { User } from "@prisma/client";
export class serverAlert{
    serverAlert:{
        client_id: string;
		priority: string;
		title: string;
		url: string;
    }
    alertTime: Date;
	alertType: string;
	users: User[];
}