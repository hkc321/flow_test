import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsController } from './extensions.controller';
import { ExtensionsService } from './extensions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExtensionEntity } from './entities/extension.entity';

describe('ExtensionsController', () => {
  let controller: ExtensionsController;

  const mockRepository = {
    // Define mock repository methods use in ExtensionsService
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtensionsController],
      providers: [
        ExtensionsService,
        {
          provide: getRepositoryToken(ExtensionEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ExtensionsController>(ExtensionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
