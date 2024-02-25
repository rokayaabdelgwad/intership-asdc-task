import { BadRequestException,ForbiddenException,NotFoundException} from "@nestjs/common";
import { HttpException ,HttpStatus} from "@nestjs/common";
export class CustomBadRequestException extends BadRequestException{
    public customError:boolean;
    constructor(message:string){
        super(message)
       
    }
}
// D:\Projects\intership asdc\intership-asdc-task2\src\utils\custom.exceptions.ts
export class CustomForbiddenException extends ForbiddenException{
    public customError :boolean;
    constructor(message:string){
        super(message)
        this.customError=true;
    }
}
export class CustomNotFoundException extends NotFoundException {
	public customError: boolean;
	constructor(message: string) {
		super(message);
		
	}
}
export class UniqueConstraintViolationException extends HttpException{
    constructor(message: string){
        super(message,HttpStatus.BAD_REQUEST)
    }
}

export class InsufficientStorageException extends HttpException{
        constructor(message:string){
            super(message,507)
}
}
export class CustomHttpException extends HttpException {
	constructor(data: any, status: number) {
		super(data, status);
	}
}