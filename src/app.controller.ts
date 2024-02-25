// app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getIndex() {
        return 'Welcome to WebSocket Events';
    }
}