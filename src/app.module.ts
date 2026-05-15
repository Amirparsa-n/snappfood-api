import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/db/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import configuration from 'src/config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(process.cwd(), '.env'), load: [configuration] }),
    PrismaModule,
    CategoryModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 ثانیه
        limit: 3, // 3 درخواست
      },
      {
        name: 'medium',
        ttl: 10000, // 10 ثانیه
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000, // 1 دقیقه
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
