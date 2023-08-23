import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ExtensionsService } from './extensions.service';
import { CreateExtensionDto } from './dto/create-extension.dto';
import { UpdateExtensionDto } from './dto/update-extension.dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createExtensionDto: CreateExtensionDto) {
    return this.extensionsService.create(
      createExtensionDto.type,
      createExtensionDto.name,
    );
  }

  @Get()
  findAll() {
    return this.extensionsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.extensionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateExtensionDto: UpdateExtensionDto,
  // ) {
  //   return this.extensionsService.update(+id, updateExtensionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extensionsService.remove(+id);
  }
}
