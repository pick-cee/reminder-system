import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUser } from 'src/interfaces';
import { UserDocument, UserModel } from 'src/schemas';
import * as argon from 'argon2'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        @InjectQueue('user') private userQueue: Queue
    ) { }

    async getProfile(userId: any) {
        const user = await this.userModel.findOne({ _id: userId }).exec()
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async updateUser(userId: any, UpdateUser: UpdateUser) {
        const user = await this.userModel.findOne({ _id: userId }).exec()
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const updatedUser = await user.updateOne({ $set: UpdateUser }, { new: true }).exec()
        return updatedUser
    }

    async deleteUser(userId: any) {
        const user = await this.userModel.findOneAndDelete(userId).exec()
        if (!user) {
            throw new NotFoundException('User not found!')
        }
        return { message: 'User deleted!' }
    }
}
