import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "src/interfaces";
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import * as argon from 'argon2'

@Schema({ collection: 'User', timestamps: true })
export class UserModel implements User {
    @Transform((v) => v.obj[v.key].toString())
    _id: string;

    @Prop({
        type: String,
        required: true,
    })
    @IsString()
    firstName: string;

    @Prop({
        type: String,
        required: true,
    })
    @IsString()
    lastName: string;

    @Prop({
        type: String,
        required: true,
        immutable: true
    })
    @IsEmail()
    email: string;

    @Prop({
        type: String,
        required: true,
        minlength: 3
    })
    @IsString()
    @MinLength(3)
    password: string;

    @Prop({ type: Date })
    @IsDate()
    lastLogin?: string | Date;

    @IsOptional()
    createdAt: string | Date;

    @IsOptional()
    updatedAt: string | Date;


    __v: number;
}

export type UserDocument = UserModel & Document
export const UserSchema = SchemaFactory.createForClass(UserModel)
UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password') || this.isNew) {
        next()
    }
    try {
        const hash = await argon.hash(this.password)
        this.password = hash
    }
    catch (err: any) {
        return next(err)
    }
})
