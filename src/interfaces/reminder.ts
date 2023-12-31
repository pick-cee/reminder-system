import { ObjectId } from "mongodb"

export interface Reminder {
    _id: string
    user: ObjectId
    details: string
    date: string | Date
    createdAt: string | Date
    updatedAt: string | Date
    __v: number
}

export interface CreateReminder extends Omit<Reminder,
    | '_id'
    | 'createdAt'
    | 'updatedAt'
> { }

export type UpdateReminder = Partial<CreateReminder>