import { ApiProperty  } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {IsOptional,IsString } from 'class-validator';

export class NationalIDDto {
    constructor(nationalID:String){
        this.nationalID = nationalID;
    }
	@ApiProperty({ example: '30008101900997', required: false })
	@IsOptional()
	@IsString()
	nationalID: String;
}