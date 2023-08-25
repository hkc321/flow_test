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
    const regExtension =
      /^(?!.*\.$)(?=.*[a-zA-Z])[a-zA-Z0-9]{1}(?:[a-zA-Z0-9.]{0,18}[a-zA-Z0-9])?(?<!\.)$/;

    if (!regExtension.test(name)) {
      throw new HttpException(
        {
          errorCode: 'invalid_data',
          errorMessage: '유효하지 않은 확장자명 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

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

    if (type === 'custom') {
      const count = await this.extensionRepository.countBy({ type: 'custom' });
      console.log(count);

      if (count > 200) {
        throw new HttpException(
          {
            errorCode: 'count_limit',
            errorMessage: '200개 이상으로 확장자를 추가할 수 없습니다.',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    const extensionEntity = this.extensionRepository.create();
    extensionEntity.type = type;
    extensionEntity.name = name;
    extensionEntity.createdAt = new Date();
    return await this.extensionRepository.save(extensionEntity);
  }

  async findAll() {
    const extensionList = await this.extensionRepository.find();
    const listLength = extensionList.length;

    return { length: listLength, extensionList: extensionList };
  }

  async findByType(type: string) {
    try {
      return await this.extensionRepository.find({
        where: { type: type },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByName(name: string): Promise<ExtensionEntity> {
    try {
      return await this.extensionRepository.findOne({
        where: { name: name },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // async update(id: number, updateExtensionDto: UpdateExtensionDto) {
  //   return `This action updates a #${id} extension`;
  // }

  async remove(name: string) {
    try {
      const result = await this.extensionRepository.delete({ name: name });
      if (result.affected === 0) {
        throw new HttpException(
          {
            errorCode: 'not_found',
            errorMessage: '존재하지 않는 확장자입니다.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // return await this.extensionRepository.delete({ name: name });
    } catch (error) {
      console.log(error);
    }
  }
}
