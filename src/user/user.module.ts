import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel, UserSchema } from "src/schemas";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
