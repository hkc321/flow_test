import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExtensionsService } from './extensions.service';
import { ExtensionsController } from './extensions.controller';
import { ExtensionEntity } from './entities/extension.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtensionEntity])],
  controllers: [ExtensionsController],
  providers: [ExtensionsService],
})
export class ExtensionsModule {}
