import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReminder, UpdateReminder } from 'src/interfaces';
import { UserDocument, UserModel } from 'src/schemas';
import { ReminderModel } from 'src/schemas/reminder.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReminderService {
    private logger = new Logger(ReminderService.name)
    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        @InjectModel(ReminderModel.name) private reminderModel: Model<ReminderModel>,
        private userSvc: UserService
    ) { }

    async createReminder(userId: any, reminderDto: CreateReminder) {
        this.logger.log(await this.userSvc.getProfile(userId))
        return await this.reminderModel.create({ ...reminderDto, user: userId })
    }

    async getAllForUsers(userId: any) {
        this.logger.log(await this.userSvc.getProfile(userId))
        const reminders = await this.reminderModel.find({ user: userId })
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
