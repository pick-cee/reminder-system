import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

export const redisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: config.get<string>('REDIS_HOST'),
                port: config.get('REDIS_PORT')
            }
        })
        return {
            store: () => store
        }
    }
}