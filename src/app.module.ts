import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/db/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { CategoryModule } from './modules/category/category.module';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(process.cwd(), '.env'), load: [configuration] }),
    PrismaModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
