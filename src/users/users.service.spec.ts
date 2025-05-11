import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUser = {
  _id: '3',
  nombre: 'Hector Salamanca',
  correoElectronico: 'hectorsalamanca@example.com',
  edad: 67,
  perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
};

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUsersRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        nombre: 'Hector Salamanca',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };

      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createUserDto: CreateUserDto = {
        nombre: 'Error User',
        correoElectronico: 'error@example.com',
        edad: 30,
        perfil: { codigo: 'E001', nombrePerfil: 'Error' },
      };

      usersRepository.create.mockRejectedValue(new Error('Duplicate key error'));

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users without filter', async () => {
      usersRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(usersRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return an array of users with filter applied', async () => {
      const search = 'Hector';
      usersRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll(search);
      expect(result).toEqual([mockUser]);
      expect(usersRepository.findAll).toHaveBeenCalledWith(search);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('3');
      expect(result).toEqual(mockUser);
      expect(usersRepository.findById).toHaveBeenCalledWith('3');
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existing')).rejects.toThrow(NotFoundException);
      expect(usersRepository.findById).toHaveBeenCalledWith('non-existing');
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        nombre: 'Hector Actualizado',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };
      const updatedUser = { ...mockUser, ...updateUserDto };
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('3', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(usersRepository.update).toHaveBeenCalledWith('3', updateUserDto);
    });

    it('should throw NotFoundException if update returns null', async () => {
      const updateUserDto: UpdateUserDto = {
        nombre: 'Hector Actualizado',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };
      usersRepository.update.mockResolvedValue(null);

      await expect(service.update('non-existing', updateUserDto)).rejects.toThrow(NotFoundException);
      expect(usersRepository.update).toHaveBeenCalledWith('non-existing', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the user', async () => {
      usersRepository.delete.mockResolvedValue(mockUser);

      const result = await service.remove('3');
      expect(result).toEqual(mockUser);
      expect(usersRepository.delete).toHaveBeenCalledWith('3');
    });

    it('should throw NotFoundException if user not found during removal', async () => {
      usersRepository.delete.mockResolvedValue(null);

      await expect(service.remove('non-existing')).rejects.toThrow(NotFoundException);
      expect(usersRepository.delete).toHaveBeenCalledWith('non-existing');
    });
  });
});
