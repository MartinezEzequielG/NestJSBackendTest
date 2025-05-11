import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../schemas/user.schema";
import { RolesGuard } from '../guards/roles.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from "@nestjs/swagger";
import { UpdateUserDto } from "../dtos/update-user.dto";

@ApiTags("usuarios")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente", type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los usuarios" })
  @ApiResponse({ status: 200, description: "Lista de usuarios", type: [User] })
  async findAll(@Query("filter") filter?: string): Promise<User[]> {
    return this.usersService.findAll(filter);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiResponse({ status: 200, description: "Usuario encontrado", type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Actualizar un usuario" })
  @ApiResponse({ status: 200, description: "Usuario actualizado", type: User })
  @ApiResponse({ status: 403, description: 'Acción no permitida' })
  @ApiHeader({
    name: 'x-user-role',
    description: 'Rol del usuario para autorizar esta acción. Debe ser "admin".',
    required: true,
  })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 403, description: 'Acción no permitida' })
  @ApiHeader({
    name: 'x-user-role',
    description: 'Rol del usuario para autorizar esta acción. Debe ser "admin".',
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}