import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExtensionsService } from './extensions.service';
import { CreateExtensionDto } from './dto/create-extension.dto';
import { Response } from 'express'; // Import the Response type

@Controller('extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createExtensionDto: CreateExtensionDto,
    @Res() res: Response,
  ) {
    const result = await this.extensionsService.create(
      createExtensionDto.type,
      createExtensionDto.name,
    );

    res
      .header('Location', '/api/extensions/' + createExtensionDto.name)
      .json(result)
      .send();
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

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return await this.extensionsService.findOneByName(name);
  }

  @Delete(':name')
  @HttpCode(204)
  async remove(@Param('name') name: string) {
    return this.extensionsService.remove(name);
  }
}
