import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UpdateUserDTO } from 'src/DTO';


@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(
        private userSvc: UserService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Get('get-profile')
    async getProfile(
        @GetUser('userId') userId: any
    ) {
        return await this.userSvc.getProfile(userId)
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update-user')
    async updateUser(
        @GetUser('userId') userId: any, @Body() updateDto: UpdateUserDTO
    ) {
        return await this.userSvc.updateUser(userId, updateDto)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('delete-user')
    async deletePassword(
        @GetUser('userId') userId: any
    ) {
        return await this.userSvc.deleteUser(userId)
    }
}
