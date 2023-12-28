import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel, UserSchema } from "src/schemas";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
        BullModule.registerQueue({ name: 'user' }, { name: 'reminder' }),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
