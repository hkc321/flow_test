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
  async findAll() {
    const fixedExtensionList = await this.extensionsService.findByType('fixed');
    const customExtensionList =
      await this.extensionsService.findByType('custom');

    return {
      fixedExtensionListLength: fixedExtensionList.length,
      fixedExtensionList: fixedExtensionList,
      customExtensionListLength: customExtensionList.length,
      customExtensionList: customExtensionList,
    };
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

  @Delete(':name')
  @HttpCode(204)
  remove(@Param('name') name: string) {
    this.extensionsService.remove(name);
  }
}
