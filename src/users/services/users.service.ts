import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UsersRepository } from "../repositories/users.repository";

@Injectable()
export class UsersService {

  //  Si fuera necesario usar almacenamiento en memoria (como indica el punto 6 de la consigna):
  // En lugar de Mongoose, podríamos usar un array local como este:
  //
  // private users: User[] = [];
  // Y simular las operaciones con métodos como .find(), .push(), etc.
  //
  // Ejemplo de create():
  // const newUser = { id: uuidv4(), ...dto }; this.users.push(newUser); return newUser;

   constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.create(dto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(search?: string): Promise<User[]> {
    return this.usersRepository.findAll(search);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const updated = await this.usersRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: string): Promise<User> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return deleted;
  }
}