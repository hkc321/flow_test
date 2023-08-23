import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExtensionDto } from './dto/create-extension.dto';
import { UpdateExtensionDto } from './dto/update-extension.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExtensionEntity } from './entities/extension.entity';

@Injectable()
export class ExtensionsService {
  constructor(
    @InjectRepository(ExtensionEntity)
    private extensionRepository: Repository<ExtensionEntity>,
  ) {}

  async create(type: string, name: string) {
    const findExtension = await this.findOneByName(name);
    if (findExtension != null) {
      throw new HttpException(
        {
          errorCode: 'already_exist',
          errorMessage: '이미 존재하는 확장자입니다.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const extensionEntity = this.extensionRepository.create();
    extensionEntity.type = type;
    extensionEntity.name = name;
    extensionEntity.isDeleted = 0;
    extensionEntity.createdAt = new Date();
    extensionEntity.deletedAt = null;

    return await this.extensionRepository.save(extensionEntity);
  }

  async findAll() {
    return `This action returns all extensions`;
  }

  async findOneByName(name: string): Promise<ExtensionEntity> {
    try {
      return await this.extensionRepository.findOne({
        where: { name },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // async update(id: number, updateExtensionDto: UpdateExtensionDto) {
  //   return `This action updates a #${id} extension`;
  // }

  async remove(id: number) {
    return `This action removes a #${id} extension`;
  }
}
