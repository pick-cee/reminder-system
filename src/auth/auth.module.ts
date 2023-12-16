import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModel, UserSchema } from "src/schemas";
import { JwtModule } from "@nestjs/jwt";
import { JwTStrategy } from "./strategy";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwTStrategy],
})
export class AuthModule { }
