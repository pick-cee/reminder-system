import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "bull";
import { Model } from "mongoose";
import { UserModel, UserDocument } from "src/schemas";


@Processor('user')
export class AuthConsumer {
    private logger = new Logger(AuthConsumer.name)
    constructor(@InjectModel(UserModel.name)
    private userModel: Model<UserDocument>,
    ) { }

    @Process('lastlogin')
    async lastlogIn(job: Job) {
        const user1 = job.data._id
        const newDate = new Date()
        await this.userModel.updateOne({ _id: user1 }, { lastLogin: newDate })
        if (job.isCompleted) {
            this.logger.log(`Successful job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`)
        }

    }
}