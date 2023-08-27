import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsService } from './extensions.service';
import { ExtensionEntity } from './entities/extension.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

describe('ExtensionsService', () => {
  let service: ExtensionsService;

  const extensionRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    countBy: jest.fn(),
  };

  const extensionRepositoryToken = getRepositoryToken(ExtensionEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExtensionsService,
        {
          provide: extensionRepositoryToken,
          useValue: extensionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ExtensionsService>(ExtensionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid extension', async () => {
      // Create a mock extension object
      const createdExtension = new ExtensionEntity();

      // Mock repository behavior
      extensionRepositoryMock.create.mockReturnValue(createdExtension);
      extensionRepositoryMock.save.mockReturnValue(createdExtension);

      // run create with valid extension name
      const result = await service.create('custom', 'validExtension');

      // assert
      expect(result).toEqual(createdExtension);
      expect(extensionRepositoryMock.create).toBeCalled();
      expect(extensionRepositoryMock.save).toHaveBeenCalledWith(
        expect.any(ExtensionEntity),
      );
    });

    it('should throw an exception for invalid extension type', async () => {
      // Run create with an invalid extension type
      const validName = 'validName';
      const invalidType = 'invalidType';
      const createPromise = service.create(invalidType, validName);
      await expect(createPromise).rejects.toThrow(HttpException);

      // to get error object
      let errorObject: HttpException;

      try {
        await createPromise;
      } catch (error) {
        errorObject = error;
      }

      // assert
      expect(errorObject.getResponse()).toEqual(
        '유효하지 않은 확장자 타입 입니다.',
      );
      expect(errorObject.getStatus()).toEqual(400);
    });

    it('should throw an exception for invalid extension name', async () => {
      // Run create with an invalid extension name
      const invalidName = '123';
      const createPromise = service.create('custom', invalidName);
      await expect(createPromise).rejects.toThrow(HttpException);

      // to get error object
      let errorObject: HttpException;

      try {
        await createPromise;
      } catch (error) {
        errorObject = error;
      }

      // assert
      expect(errorObject.getResponse()).toEqual(
        '유효하지 않은 커스텀 확장자명 입니다.',
      );
      expect(errorObject.getStatus()).toEqual(400);
    });

    it('should throw an exception for already exist extension name', async () => {
      // Mock repository behavior
      extensionRepositoryMock.findOne.mockReturnValue({});

      // Run create with an valid extension name
      const validName = 'asda';
      const createPromise = service.create('custom', validName);

      // to get error object
      let errorObject: HttpException;

      try {
        await createPromise;
      } catch (error) {
        errorObject = error;
      }

      // assert
      await expect(createPromise).rejects.toThrow(HttpException);
      expect(errorObject.getResponse()).toEqual(
        '이미 존재하는 커스텀 확장자입니다.',
      );
      expect(errorObject.getStatus()).toEqual(409);
    });

    it('should throw an exception when number of extensions in db more than 200', async () => {
      // Mock repository behavior
      extensionRepositoryMock.findOne.mockReturnValue(null);
      extensionRepositoryMock.countBy.mockReturnValue(200);

      // Run create with an valid extension name
      const validName = 'asda';
      const createPromise = service.create('custom', validName);

      // to get error object
      let errorObject: HttpException;

      try {
        await createPromise;
      } catch (error) {
        errorObject = error;
      }

      // assert
      await expect(createPromise).rejects.toThrow(HttpException);
      expect(errorObject.getResponse()).toEqual(
        '200개 이상으로 확장자를 추가할 수 없습니다.',
      );
      expect(errorObject.getStatus()).toEqual(409);
    });
  });

  describe('remove', () => {
    it('should remove a valid extension', async () => {
      // Mock repository behavior
      extensionRepositoryMock.delete.mockReturnValue({ affected: 1 });

      // run remove with extensionId
      await service.remove(1);

      // assert
      expect(extensionRepositoryMock.delete).toBeCalled();
    });

    it('should throw an exception for none exist extension', async () => {
      // Mock repository behavior
      extensionRepositoryMock.delete.mockReturnValue({ affected: 0 });

      // run remove with noneExistextensionId
      const noneExistExtensionId = 0;
      const result = service.remove(noneExistExtensionId);

      // to get error object
      let errorObject: HttpException;

      try {
        await result;
      } catch (error) {
        errorObject = error;
      }

      // assert
      expect(extensionRepositoryMock.delete).toHaveBeenCalledWith({
        extensionId: noneExistExtensionId,
      });
      expect(errorObject.getResponse()).toEqual('존재하지 않는 확장자입니다.');
      expect(errorObject.getStatus()).toEqual(404);
    });
  });

  describe('findByType', () => {
    it('should excute with provided type', async () => {
      // run findByType
      const type = 'someType';
      await service.findByType(type);

      // assert
      expect(extensionRepositoryMock.find).toBeCalledWith({
        where: { type: type },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOneByName', () => {
    it('should excute with provided name', async () => {
      // run findByType
      const name = 'someName';
      await service.findOneByName(name);

      // assert
      expect(extensionRepositoryMock.findOne).toBeCalledWith({
        where: { name: name },
      });
    });
  });

  describe('findOneById', () => {
    it('should excute with provided name', async () => {
      // run findByType
      const extensionId = 1;
      await service.findOneById(extensionId);

      // assert
      expect(extensionRepositoryMock.findOne).toBeCalledWith({
        where: { extensionId: extensionId },
      });
    });
  });
});
