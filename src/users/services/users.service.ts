import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

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

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ correoElectronico: createUserDto.correoElectronico })
      .exec();
  
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }
  
    const newUser = new this.userModel(createUserDto);
    
    try {
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('No se pudo crear el usuario: ' + error.message);
    }
  }
  
  async findAll(filter?: string): Promise<User[]> {
    const query = filter ? { nombre: new RegExp(filter, "i") } : {};
    return this.userModel.find(query).exec();
  }

  async findOne(id: string): Promise<User> {
    const found = await this.userModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException("Usuario con id ${id} no encontrado");
    }
    return found;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException("Usuario con id ${id} no encontrado");
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException("Usuario con id ${id} no encontrado");
    }
    return deletedUser;
  }
}