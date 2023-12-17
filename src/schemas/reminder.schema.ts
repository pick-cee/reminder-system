import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { IsString, IsOptional, IsDate } from "class-validator";
import { Reminder } from "src/interfaces";


@Schema({ collection: 'Reminder', timestamps: true })
export class ReminderModel implements Reminder {
    @Transform((v) => v.obj[v.key].toString())
    _id: string;

    @Prop({
        type: String,
        required: true
    })
    @IsString()
    user: string;

    @Prop({
        type: String,
        required: true
    })
    @IsString()
    details: string;

    @Prop({
        type: String || Date,
        required: true
    })
    @IsDate()
    date: string | Date;

    @IsOptional()
    createdAt: string | Date;

    @IsOptional()
    updatedAt: string | Date;


    __v: number;
}

export type ReminderDocument = ReminderModel & Document
export const UserSchema = SchemaFactory.createForClass(ReminderModel)