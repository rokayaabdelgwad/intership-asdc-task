
import {
	BadRequestException,
	HttpException,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import {
	CustomBadRequestException,
	CustomForbiddenException,
	CustomHttpException,
	CustomNotFoundException,
	UniqueConstraintViolationException,
} from './custom.exceptions';



export function handleException(error: Error, dev_flag = false, data: any = undefined) {
	if (
		!(error instanceof CustomBadRequestException) &&
		!(error instanceof CustomForbiddenException) &&
		!(error instanceof CustomNotFoundException) &&
		!(error instanceof CustomHttpException) &&
		!(error instanceof UnauthorizedException)
	) {
		
	const genericMessage = 'Something went wrong, please contact ASDC support!';

	if (error instanceof PrismaClientKnownRequestError) {
		if (error.code === 'P2002') {
			throw new UniqueConstraintViolationException((error as Error).message);
		}
		throw new BadRequestException((error as Error).message);
	}
	if (error instanceof HttpException) {
		throw error;
	}
	if (error instanceof PrismaClientUnknownRequestError) {
		throw new BadRequestException(genericMessage);
	}
	if (error instanceof UnauthorizedException) {
		throw new CustomBadRequestException('You Are not Authorized to perform this action!');
	}
	if (
		error instanceof CustomBadRequestException ||
		error instanceof CustomForbiddenException ||
		error instanceof CustomNotFoundException ||
		error instanceof CustomHttpException
	) {
		throw error;
	}

	console.log({ errorMessage: error.message });
	console.log({ errorName: error.name });
	console.log({ errorStack: error.stack });
	console.log({ errorData: data });
	throw new InternalServerErrorException(genericMessage);
}


}