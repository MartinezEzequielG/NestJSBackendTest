import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
     providers: [
            {
                provide: UsersService,
                useValue: {
                findAll: jest.fn().mockResolvedValue([]),
                create: jest.fn(),
                update: jest.fn(),
                remove: jest.fn(),
                },
            },
        ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

it('should be defined', () => {
    expect(usersController).toBeDefined();
});

it('should return an array of users', async () => {
    const result = await usersController.findAll();
    expect(result).toEqual([]);
    expect(usersService.findAll).toHaveBeenCalled();
});

it('should create a new user', async () => {
  const createUserDto = {
    nombre: 'Hector Salamanca',
    correoElectronico: 'hectorsalamanca@example.com',
    edad: 67,
    perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
  };

  const createdUser = { _id: '3', ...createUserDto };

  jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

    const result = await usersController.create(createUserDto);
        expect(result).toEqual(createdUser);
        expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should update and return the user', async () => {
    const updateUserDto = {
        nombre: 'Hector Actualizado',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 68,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
    };

    const updatedUser = { _id: '3', ...updateUserDto };

    jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

    const result = await usersController.update('3', updateUserDto);
        expect(result).toEqual(updatedUser);
        expect(usersService.update).toHaveBeenCalledWith('3', updateUserDto);
    });

  it('should handle errors when deletion fails', async () => {
    jest.spyOn(usersService, 'remove').mockRejectedValue(new Error('Deletion failed'));

    await expect(usersController.remove('3')).rejects.toThrow('Deletion failed');
  });
});