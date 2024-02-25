export class loggingOutAlert {
	email: string;
	role: string;
	oldTokens: [
		{
			id: number;
			createdAt: Date;
			email: string;
			isExpired: boolean;
			token: string;
		},
	];
	user_id: number;
}