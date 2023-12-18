import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto, UpdateReminderDto } from 'src/DTO/reminder.dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('reminder')
export class ReminderController {
  private logger = new Logger(ReminderController.name)
  constructor(private readonly reminderService: ReminderService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createReminder(@GetUser('userId') userId: any, @Body() dto: CreateReminderDto) {
    return this.reminderService.createReminder(userId, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getReminders(@GetUser('userId') userId: any) {
    return this.reminderService.getAllForUsers(userId)
  }

  @HttpCode(HttpStatus.OK)
  @Patch('update')
  async updateReminder(
    @GetUser('userId') userId: any,
    @Query('reminderId') reminderId: any,
    @Body() dto: UpdateReminderDto
  ) {
    return this.reminderService.updateReminder(reminderId, userId, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteReminder(
    @Query('reminderId') reminderId: any,
    @GetUser('userId') userId: any
  ) {
    return this.reminderService.deleteReminder(reminderId, userId)
  }
}
