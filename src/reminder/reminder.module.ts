import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/schemas';
import { UserService } from 'src/user/user.service';
import { ReminderModel, ReminderSchema } from 'src/schemas/reminder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: ReminderModel.name, schema: ReminderSchema }
    ])
  ],
  controllers: [ReminderController],
  providers: [ReminderService, UserService],
})
export class ReminderModule { }
