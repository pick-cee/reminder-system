import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Novu } from "@novu/node";
import { Job } from "bull";
import { Model } from "mongoose";
import { UserDocument, UserModel } from "src/schemas";
import { ReminderDocument, ReminderModel } from "src/schemas/reminder.schema";
import cron from 'node-cron'
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Processor('reminder')
export class ReminderConsumer {
    novu = new Novu(`${process.env.NOVU_API_KEY}`)
    private logger = new Logger(ReminderConsumer.name)
    constructor(
        @InjectModel(UserModel.name)
        private userModel: Model<UserDocument>,
        @InjectModel(ReminderModel.name)
        private reminderModel: Model<ReminderDocument>,
        private readonly scheduleRegistry: SchedulerRegistry
    ) { }

    // addNewJob(jobName: string, cronExpression: string) {
    //     const job = new CronJob(`${cronExpression}`, () => {

    //     })

    //     this.scheduleRegistry.addCronJob(jobName, job);
    //     job.start();

    //     console.log(`Job ${name} added for every ${cronExpression} seconds`)
    // }

    @Process('reminder-notification')
    async reminderNotification(job: Job) {
        const reminderId = job.data._id
        const userId = job.data.user
        const reminder = await this.reminderModel.findOne({ _id: reminderId })
        const user = await this.userModel.findOne({ _id: userId })

        const newDate = new Date(job.data.date)
        const hours = newDate.getUTCHours() + 1
        const minute = newDate.getUTCMinutes()
        const dayofMonth = newDate.getUTCDate()
        const month = newDate.getUTCMonth() + 1
        const dayOfWeek = newDate.getUTCDay()
        const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        const cronExpression = `${minute} ${hours} ${dayofMonth} ${month} ${adjustedDayOfWeek}`

        const cronJob = new CronJob(`${cronExpression}`, async () => {
            await this.novu.trigger('first', {
                to: {
                    subscriberId: userId,
                    email: user.email
                },
                payload: {
                    firstname: user.firstName,
                    reminderDetails: reminder.details
                }
            })
            console.log('Cron job has completed')
        })
        this.scheduleRegistry.addCronJob('reminder-notification', cronJob)
        cronJob.start()
    }

}