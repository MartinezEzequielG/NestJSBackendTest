import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Profile {
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  nombrePerfil: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema()
export class User {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correoElectronico: string;

  @Prop({ required: true, min: 0, max: 120 })
    edad: number;

  @Prop({ type: ProfileSchema, required: true })
  perfil: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);