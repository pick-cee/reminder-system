import { CreateReminder, UpdateReminder } from "src/interfaces";
import { ReminderModel } from "src/schemas/reminder.schema";


export class CreateReminderDto
    extends ReminderModel implements CreateReminder { }

export class UpdateReminderDto
    extends CreateReminderDto implements UpdateReminder { }