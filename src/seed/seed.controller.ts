import { Controller, Get, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Post('seed')
    async seed() {
        return await this.seedService.seed();
    }

    @Get('app-version')
    getMinimumVersion() {
        return { version: '1.0.0' };
    }
}
