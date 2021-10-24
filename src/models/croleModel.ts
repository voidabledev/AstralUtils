import { model, Schema } from 'mongoose';

export interface CustomRole {
  userId: string;
  roleId: string;
}

const schema = new Schema({
	userId: String,
	roleId: String,
});

export const croleModel = model<CustomRole>('custom-role', schema);
