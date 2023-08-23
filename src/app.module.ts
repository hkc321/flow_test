import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtensionsModule } from './extensions/extensions.module';
import { ExtensionsController } from './extensions/extensions.controller';
import { ExtensionsService } from './extensions/extensions.service';
import { ExtensionEntity } from './extensions/entities/extension.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      entities: [ExtensionEntity],
      synchronize: true,
      logging: true,
    }),
    ExtensionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
