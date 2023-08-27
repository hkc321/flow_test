import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const typeList = ['fixed', 'custom'];
    if (!typeList.includes(type)) {
      throw new HttpException(
        '유효하지 않은 확장자 타입 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const regExtension =
      /^(?!.*\.\.)(?!.*\.$)[a-zA-Z][a-zA-Z0-9]*\.?[a-zA-Z0-9]*$/;
    const nameLength = name.length;

    if (!regExtension.test(name) || nameLength > 20 || nameLength < 1) {
      throw new HttpException(
        '유효하지 않은 커스텀 확장자명 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findExtension = await this.findOneByName(name);
    if (findExtension != null) {
      throw new HttpException(
        '이미 존재하는 커스텀 확장자입니다.',
        HttpStatus.CONFLICT,
      );
    }

    if (type === 'custom') {
      const count = await this.extensionRepository.countBy({ type: 'custom' });

      if (count >= 200) {
        throw new HttpException(
          '200개 이상으로 확장자를 추가할 수 없습니다.',
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

  async findByType(type: string) {
    return await this.extensionRepository.find({
      where: { type: type },
      order: { name: 'ASC' },
    });
  }

  async findOneById(extensionId: number) {
    return await this.extensionRepository.findOne({
      where: { extensionId: extensionId },
    });
  }

  async findOneByName(name: string): Promise<ExtensionEntity> {
    return await this.extensionRepository.findOne({
      where: { name: name },
    });
  }

  async remove(extensionId: number) {
    const result = await this.extensionRepository.delete({
      extensionId: extensionId,
    });
    if (result.affected === 0) {
      throw new HttpException(
        '존재하지 않는 확장자입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
