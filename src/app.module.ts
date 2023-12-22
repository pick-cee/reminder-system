import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ReminderModule } from "./reminder/reminder.module";
import { CacheModule } from "@nestjs/cache-manager";
import { redisOptions } from "./redis/redisOptions";
import { redisStore } from "cache-manager-redis-store";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(redisOptions),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const uri = config.get("MONGODB_URI");
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ReminderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
