import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReminder, UpdateReminder } from 'src/interfaces';
import { UserDocument, UserModel } from 'src/schemas';
import { ReminderModel } from 'src/schemas/reminder.schema';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReminderService {
    private logger = new Logger(ReminderService.name)
    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        @InjectModel(ReminderModel.name) private reminderModel: Model<ReminderModel>,
        @Inject(CACHE_MANAGER) private cacheManagaer: Cache,
        private userSvc: UserService,
        @InjectQueue('reminder') private reminderQueue: Queue,
    ) { }

    async createReminder(userId: any, reminderDto: CreateReminder) {
        const newReminder = await this.reminderModel.create({ ...reminderDto, user: userId })
        const Queue = await this.reminderQueue.add('reminder-notification',
            { user: userId, details: reminderDto.details, date: reminderDto.date, _id: newReminder._id })
        this.logger.log
        return newReminder
    }

    async getAllForUsers(userId: any) {
        const value = await this.cacheManagaer.get('reminders-for-users')
        if (value) {
            this.logger.log(value)
            return value
        }
        const reminders = await this.reminderModel.find({ user: userId })
        await this.cacheManagaer.set('reminders-for-users', reminders)
        return reminders
    }

    async updateReminder(reminderId: any, userId: any, updateDto: UpdateReminder) {
        const reminder = await this.reminderModel.findOne({ _id: reminderId, user: userId }).exec()
        if (!reminder) {
            throw new NotFoundException('Reminder not found')
        }
        const updatedReminder = await reminder.updateOne({ $set: updateDto }, { $new: true }).exec()
        return { message: 'Reminder updated successfully', updatedReminder }
    }

    async deleteReminder(reminderId: any, userId: any) {
        const reminder = await this.reminderModel.findOneAndDelete({ _id: reminderId, user: userId }).exec()
        if (!reminder) {
            throw new NotFoundException('Reminder not found')
        }
        return { message: "Remider deleted successfully" }
    }
}
