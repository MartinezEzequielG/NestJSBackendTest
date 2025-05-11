import { IsNotEmpty, IsEmail, IsInt, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'A001' })
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: 'Administrador' })
  @IsNotEmpty()
  nombrePerfil: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @IsEmail()
  correoElectronico: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  @Max(120)
  edad: number;

  @ApiProperty({ type: CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  perfil: CreateProfileDto;
}