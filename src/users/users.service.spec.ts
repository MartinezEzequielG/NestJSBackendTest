import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./services/users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { BadRequestException, NotFoundException } from "@nestjs/common";

const mockUser = {
  _id: '3',
  nombre: 'Hector Salamanca',
  correoElectronico: 'hectorsalamanca@example.com',
  edad: 67,
  perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
};

/*
  Creamos un mock que simula el constructor de Mongoose.  
  Al invocarlo (i.e. new this.userModel(dto)), se retornará un objeto 
  con el método "save".
*/
const mockUserModel = Object.assign(
  jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockUser),
  })),
  {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }
);

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));

    jest.clearAllMocks();
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockUserModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    });
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockUserModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockUserModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        nombre: 'Hector Salamanca',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserModel).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException if error occurs during creation', async () => {
      const createUserDto = {
        nombre: 'Error User',
        correoElectronico: 'error@example.com',
        edad: 30,
        perfil: { codigo: 'E001', nombrePerfil: 'Error' },
      };

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const saveMock = jest.fn().mockRejectedValue(new Error('Duplicate key error'));
      mockUserModel.mockImplementationOnce((dto) => ({
        ...dto,
        save: saveMock,
      }));

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users without filter', async () => {
      const usersArray = [mockUser];
      userModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(usersArray),
      });
      const result = await service.findAll();
      expect(result).toEqual(usersArray);
      expect(userModel.find).toHaveBeenCalledWith({});
    });

    it('should return an array of users with filter applied', async () => {
      const filter = 'Hector';
      const usersArray = [mockUser];
      userModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(usersArray),
      });
      const result = await service.findAll(filter);
      expect(result).toEqual(usersArray);
      expect(userModel.find).toHaveBeenCalledWith({ nombre: new RegExp(filter, "i") });
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      userModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      });
      const result = await service.findOne('3');
      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith('3');
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(service.findOne('non-existing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto = {
        nombre: 'Hector Actualizado',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };
      const updatedUser = { ...mockUser, ...updateUserDto };
      userModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(updatedUser),
      });
      const result = await service.update('3', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('3', updateUserDto, { new: true });
    });
  
    it('should throw NotFoundException if update returns null', async () => {
      userModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      const updateUserDto = {
        nombre: 'Hector Actualizado',
        correoElectronico: 'hectorsalamanca@example.com',
        edad: 67,
        perfil: { codigo: 'A003', nombrePerfil: 'Usuario' },
      };
      await expect(service.update('non-existing', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('remove', () => {
    it('should remove and return the user', async () => {
      userModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      });
      const result = await service.remove('3');
      expect(result).toEqual(mockUser);
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('3');
    });

    it('should throw NotFoundException if user not found during removal', async () => {
      userModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(service.remove('non-existing')).rejects.toThrow(NotFoundException);
    });
  });
});