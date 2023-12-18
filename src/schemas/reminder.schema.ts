import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Transform } from "class-transformer";
import { IsString, IsOptional, IsDate, IsMongoId } from "class-validator";
import { Reminder } from "src/interfaces";
import { ObjectId } from "mongodb";


@Schema({ collection: 'Reminder', timestamps: true })
export class ReminderModel implements Reminder {
    @Transform((v) => v.obj[v.key].toString())
    _id: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    })
    @IsMongoId()
    user: ObjectId;

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
export const ReminderSchema = SchemaFactory.createForClass(ReminderModel)